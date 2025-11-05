import type { SubscriptionStatus } from './api/useSubscriptionApi';
import { useSubscriptionApi } from './api/useSubscriptionApi';

/**
 * Singleton global para gerenciar uma única conexão Realtime compartilhada
 * entre todos os componentes que precisam do status de subscription
 */
class GlobalSubscriptionRealtimeManager {
  private static instance: GlobalSubscriptionRealtimeManager | null = null;
  
  private supabase: ReturnType<typeof useSupabaseClient> | null = null;
  private user: ReturnType<typeof useSupabaseUser> | null = null;
  private status: Ref<SubscriptionStatus | null> = ref(null);
  private loading: Ref<boolean> = ref(false);
  
  // Realtime e polling
  private realtimeChannel: ReturnType<ReturnType<typeof useSupabaseClient>['channel']> | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private expirationCheckIntervalId: NodeJS.Timeout | null = null;
  
  // Listeners registrados
  private listeners: Set<(status: SubscriptionStatus | null) => void> = new Set();
  private loadStatusCallbacks: Set<() => Promise<SubscriptionStatus | null>> = new Set();
  
  // Contadores para saber quando parar/limpar
  private activeComponentCount = 0;

  private constructor() {}

  static getInstance(): GlobalSubscriptionRealtimeManager {
    if (!GlobalSubscriptionRealtimeManager.instance) {
      GlobalSubscriptionRealtimeManager.instance = new GlobalSubscriptionRealtimeManager();
    }
    return GlobalSubscriptionRealtimeManager.instance;
  }

  /**
   * Registra um componente como ativo
   */
  registerComponent(
    loadStatusFn: () => Promise<SubscriptionStatus | null>,
    onStatusChange?: (status: SubscriptionStatus | null) => void
  ) {
    this.activeComponentCount++;
    
    if (loadStatusFn) {
      this.loadStatusCallbacks.add(loadStatusFn);
    }
    
    if (onStatusChange) {
      this.listeners.add(onStatusChange);
      // Notificar imediatamente com o status atual
      onStatusChange(this.status.value);
    }

    // Iniciar se for o primeiro componente
    if (this.activeComponentCount === 1) {
      this.initialize();
    }

    return {
      status: this.status,
      loading: this.loading,
      unregister: () => this.unregisterComponent(loadStatusFn, onStatusChange),
    };
  }

  /**
   * Remove um componente
   */
  private unregisterComponent(
    loadStatusFn?: () => Promise<SubscriptionStatus | null>,
    onStatusChange?: (status: SubscriptionStatus | null) => void
  ) {
    this.activeComponentCount--;
    
    if (loadStatusFn) {
      this.loadStatusCallbacks.delete(loadStatusFn);
    }
    
    if (onStatusChange) {
      this.listeners.delete(onStatusChange);
    }

    // Parar se não houver mais componentes ativos
    if (this.activeComponentCount === 0) {
      this.cleanup();
    }
  }

  /**
   * Inicializa o sistema (Realtime + Polling)
   */
  private async initialize() {
    if (!this.supabase) {
      this.supabase = useSupabaseClient();
    }
    
    if (!this.user) {
      this.user = useSupabaseUser();
    }

    if (this.user?.value) {
      // Carregar status inicial
      await this.loadStatus();
      
      // Configurar Realtime e polling
      this.setupRealtimeSubscription();
      this.startPolling();
      this.startExpirationCheck();
      this.setupWatchers();
    }
  }

  /**
   * Configura watchers para mudanças no usuário e status
   */
  private setupWatchers() {
    if (!this.user) return;

    // Observar mudanças no usuário
    watch(this.user, async (newUser) => {
      if (newUser) {
        await this.loadStatus();
        this.setupRealtimeSubscription();
        this.startPolling();
        this.startExpirationCheck();
      } else {
        this.cleanup();
        this.status.value = null;
        this.notifyListeners(null);
      }
    }, { immediate: false });

    // Observar mudanças no hasAccess para ajustar polling
    watch(() => this.status.value?.hasAccess, () => {
      if (this.intervalId && this.user?.value) {
        this.startPolling();
      }
    });

    // Observar mudanças no hasTemporaryAccess para ajustar verificação de expiração
    watch(() => this.status.value?.hasTemporaryAccess, () => {
      this.startExpirationCheck();
    });
  }

  /**
   * Limpa todos os recursos
   */
  private cleanup() {
    this.removeRealtimeSubscription();
    this.stopPolling();
    this.stopExpirationCheck();
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners(newStatus: SubscriptionStatus | null) {
    this.listeners.forEach(listener => {
      try {
        listener(newStatus);
      } catch (error) {
        console.error('Error in status change listener:', error);
      }
    });
  }

  /**
   * Atualiza o status e notifica listeners
   */
  updateStatus(newStatus: SubscriptionStatus | null) {
    this.status.value = newStatus;
    this.notifyListeners(newStatus);
  }

  /**
   * Getter público para o status
   */
  getStatus(): Ref<SubscriptionStatus | null> {
    return this.status;
  }

  /**
   * Getter público para o loading
   */
  getLoading(): Ref<boolean> {
    return this.loading;
  }

  /**
   * Carrega o status usando qualquer callback disponível
   */
  async loadStatus(): Promise<SubscriptionStatus | null> {
    if (this.loadStatusCallbacks.size === 0) {
      return null;
    }

    this.loading.value = true;
    try {
      const firstCallback = Array.from(this.loadStatusCallbacks)[0];
      if (!firstCallback) {
        return null;
      }
      const newStatus = await firstCallback();
      this.updateStatus(newStatus);
      return newStatus;
    } catch (error) {
      console.error('Error loading subscription status:', error);
      this.updateStatus(null);
      return null;
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * Marca registros expirados
   */
  private async markExpiredAccess() {
    if (!this.user?.value || !this.supabase) return;

    try {
      await this.supabase.rpc('mark_expired_temporary_access');
    } catch (error) {
      console.warn('Failed to mark expired temporary access:', error);
    }
  }

  /**
   * Configura o Supabase Realtime
   */
  private setupRealtimeSubscription() {
    if (!this.user?.value || !this.supabase) return;

    this.removeRealtimeSubscription();

    const channelName = `subscription_realtime_${this.user.value.id}_${Date.now()}`;
    
    this.realtimeChannel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'temporary_access',
          filter: `user_id=eq.${this.user.value.id}`,
        },
        async () => {
          await this.loadStatus();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${this.user.value.id}`,
        },
        async () => {
          await this.loadStatus();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to subscription changes (global)');
        }
      });
  }

  /**
   * Remove subscription do Realtime
   */
  private removeRealtimeSubscription() {
    if (this.realtimeChannel && this.supabase) {
      this.supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  /**
   * Inicia polling
   */
  private startPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    if (this.user?.value) {
      const hasAccess = this.status.value?.hasAccess ?? false;
      const interval = hasAccess ? 60000 : 10000; // 60s se tem acesso, 10s se não tem
      this.intervalId = setInterval(() => {
        this.loadStatus();
      }, interval);
    }
  }

  /**
   * Para polling
   */
  private stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Inicia verificação de expiração
   */
  private startExpirationCheck() {
    if (this.expirationCheckIntervalId) {
      clearInterval(this.expirationCheckIntervalId);
      this.expirationCheckIntervalId = null;
    }
    
    if (this.user?.value && this.status.value?.hasTemporaryAccess) {
      this.expirationCheckIntervalId = setInterval(() => {
        this.markExpiredAccess().then(() => {
          this.loadStatus();
        });
      }, 30000); // 30 segundos
    }
  }

  /**
   * Para verificação de expiração
   */
  private stopExpirationCheck() {
    if (this.expirationCheckIntervalId) {
      clearInterval(this.expirationCheckIntervalId);
      this.expirationCheckIntervalId = null;
    }
  }

}

/**
 * Composable otimizado que usa o singleton global
 */
export function useGlobalSubscriptionRealtime(options: {
  onStatusChange?: (status: SubscriptionStatus | null) => void;
  onlyHasAccess?: boolean;
  autoStart?: boolean;
} = {}) {
  const {
    onStatusChange,
    onlyHasAccess = false,
    autoStart = true,
  } = options;

  const { checkSubscriptionStatus } = useSubscriptionApi();
  const manager = GlobalSubscriptionRealtimeManager.getInstance();
  const route = useRoute();
  const router = useRouter();
  
  // Função para carregar status
  const loadStatus = async (): Promise<SubscriptionStatus | null> => {
    const user = useSupabaseUser();
    if (!user.value) {
      return null;
    }

    try {
      // Primeiro marcar expirados
      const supabase = useSupabaseClient();
      try {
        await supabase.rpc('mark_expired_temporary_access');
      } catch {
        // Ignorar erro silenciosamente
      }
      
      // Depois buscar status
      return await checkSubscriptionStatus();
    } catch (error) {
      console.error('Error loading subscription status:', error);
      return null;
    }
  };

  // Callback para passar para o manager
  const handleStatusChange = (newStatus: SubscriptionStatus | null) => {
    // Chamar callback original se fornecido
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  let unregister: (() => void) | null = null;

  if (autoStart) {
    onMounted(() => {
      const registration = manager.registerComponent(loadStatus, handleStatusChange);
      unregister = registration.unregister;
    });

    onUnmounted(() => {
      if (unregister) {
        unregister();
      }
    });
  }

  // Criar computed para acessar o status
  const statusRef = manager.getStatus();
  const loadingRef = manager.getLoading();
  const status = computed(() => statusRef.value);
  const loading = computed(() => loadingRef.value);
  const hasAccess = computed(() => status.value?.hasAccess ?? false);

  // Observar mudanças no status para redirecionar quando perder acesso
  const initialStatus = status.value;
  let previousHasAccess: boolean | null = typeof initialStatus === 'boolean' ? initialStatus : (initialStatus?.hasAccess ?? false);
  let hasRedirected = false;

  watch(status, async (newStatus) => {
    const currentHasAccess = typeof newStatus === 'boolean' ? newStatus : (newStatus?.hasAccess ?? false);
    
    // Se o acesso foi perdido (tinha antes e agora não tem), redirecionar
    if (previousHasAccess === true && currentHasAccess === false && !hasRedirected) {
      hasRedirected = true;
      
      const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/callback', '/profile', '/subscription/success', '/subscription/cancel', '/temporary-access/request'];
      const isPublicRoute = publicRoutes.some(routePath => {
        if (routePath === '/') {
          return route.path === '/';
        }
        return route.path.startsWith(routePath);
      });
      
      if (!isPublicRoute) {
        // Aguardar um tick para garantir que a navegação aconteça após o ciclo de atualização
        await nextTick();
        router.push('/profile?tab=subscription');
      }
    }
    
    // Resetar flag quando acesso é recuperado
    if (previousHasAccess === false && currentHasAccess === true) {
      hasRedirected = false;
    }
    
    previousHasAccess = currentHasAccess;
  }, { immediate: false });

  return {
    status: onlyHasAccess ? hasAccess : status,
    hasAccess,
    loading,
    loadStatus: () => manager.loadStatus(),
  };
}

