import { useSubscriptionApi, type SubscriptionStatus } from './api/useSubscriptionApi';

export interface UseSubscriptionRealtimeOptions {
  /**
   * Callback chamado quando o status é atualizado
   */
  onStatusChange?: (status: SubscriptionStatus | null) => void;
  
  /**
   * Se true, retorna apenas hasAccess. Se false, retorna o status completo.
   * @default false
   */
  onlyHasAccess?: boolean;
  
  /**
   * Intervalo de polling quando o usuário não tem acesso (em ms)
   * @default 10000 (10 segundos)
   */
  pollingIntervalNoAccess?: number;
  
  /**
   * Intervalo de polling quando o usuário tem acesso (em ms)
   * @default 60000 (60 segundos)
   */
  pollingIntervalWithAccess?: number;
  
  /**
   * Se true, inicia automaticamente ao montar o componente
   * @default true
   */
  autoStart?: boolean;
}

/**
 * Composable para gerenciar atualização em tempo real do status de subscription
 * Usa Supabase Realtime para detectar mudanças imediatamente e polling como fallback
 */
export function useSubscriptionRealtime(options: UseSubscriptionRealtimeOptions = {}) {
  const {
    onStatusChange,
    onlyHasAccess = false,
    pollingIntervalNoAccess = 10000,
    pollingIntervalWithAccess = 60000,
    autoStart = true,
  } = options;

  const { checkSubscriptionStatus } = useSubscriptionApi();
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  
  const status = ref<SubscriptionStatus | null>(null);
  const hasAccess = computed(() => status.value?.hasAccess ?? false);
  const loading = ref(false);

  // Realtime e polling
  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
  let intervalId: NodeJS.Timeout | null = null;
  let expirationCheckIntervalId: NodeJS.Timeout | null = null;

  /**
   * Marca registros expirados no banco de dados
   */
  const markExpiredAccess = async () => {
    if (!user.value) return;

    try {
      // Chamar função RPC para marcar acessos temporários expirados
      await supabase.rpc('mark_expired_temporary_access');
    } catch (error) {
      // Se a função RPC falhar, apenas logar e continuar
      // O trigger já deve ter atualizado na inserção/atualização
      console.warn('Failed to mark expired temporary access:', error);
    }
  };

  /**
   * Carrega o status da subscription/temporary access
   * Primeiro marca os expirados, depois busca o status
   */
  const loadStatus = async () => {
    if (!user.value) {
      status.value = null;
      if (onStatusChange) {
        onStatusChange(null);
      }
      return null;
    }

    try {
      loading.value = true;
      
      // Primeiro, marcar como expirados os que já passaram da data
      await markExpiredAccess();
      
      // Depois, buscar o status atualizado
      const newStatus = await checkSubscriptionStatus();
      
      if (newStatus) {
        status.value = newStatus;
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
      
      return newStatus;
    } catch (error) {
      console.error('Error loading subscription status:', error);
      status.value = null;
      if (onStatusChange) {
        onStatusChange(null);
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Configura o Supabase Realtime para escutar mudanças nas tabelas
   */
  const setupRealtimeSubscription = () => {
    if (!user.value) return;

    // Remover subscription anterior se existir
    removeRealtimeSubscription();

    // Criar canal para escutar mudanças nas tabelas relevantes
    const channelName = `subscription_realtime_${user.value.id}_${Date.now()}`;
    
    realtimeChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'temporary_access',
          filter: `user_id=eq.${user.value.id}`,
        },
        async (payload) => {
          console.log('Temporary access changed:', payload);
          // Quando há mudança na tabela, atualizar status imediatamente
          await loadStatus();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.value.id}`,
        },
        async (payload) => {
          console.log('Subscription changed:', payload);
          // Quando há mudança na tabela, atualizar status imediatamente
          await loadStatus();
        }
      )
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === 'SUBSCRIBED') {
          console.log('Subscribed to subscription changes');
        }
      });
  };

  /**
   * Remove a subscription do Realtime
   */
  const removeRealtimeSubscription = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  };

  /**
   * Inicia o polling como fallback
   */
  const startPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    if (user.value) {
      const interval = hasAccess.value ? pollingIntervalWithAccess : pollingIntervalNoAccess;
      intervalId = setInterval(() => {
        loadStatus();
      }, interval);
    }
  };

  /**
   * Para o polling
   */
  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * Inicia verificação de expiração (mais frequente quando tem acesso temporário)
   */
  const startExpirationCheck = () => {
    // Sempre parar o intervalo anterior primeiro
    if (expirationCheckIntervalId) {
      clearInterval(expirationCheckIntervalId);
      expirationCheckIntervalId = null;
    }
    
    // Iniciar apenas se o usuário tem acesso temporário ativo
    if (user.value && status.value?.hasTemporaryAccess) {
      // Verificar expiração a cada 30 segundos quando tem acesso temporário ativo
      expirationCheckIntervalId = setInterval(() => {
        markExpiredAccess().then(() => {
          // Depois de marcar expirados, recarregar status
          loadStatus();
        });
      }, 30000); // 30 segundos
    }
  };

  /**
   * Para a verificação de expiração
   */
  const stopExpirationCheck = () => {
    if (expirationCheckIntervalId) {
      clearInterval(expirationCheckIntervalId);
      expirationCheckIntervalId = null;
    }
  };

  /**
   * Inicia o sistema de atualização (Realtime + Polling + Expiration Check)
   */
  const start = async () => {
    await loadStatus();
    
    if (user.value) {
      setupRealtimeSubscription();
      startPolling();
      startExpirationCheck();
    }
  };

  /**
   * Para o sistema de atualização
   */
  const stop = () => {
    removeRealtimeSubscription();
    stopPolling();
    stopExpirationCheck();
  };

  // Observar mudanças no usuário
  watch(user, async (newUser) => {
    if (newUser) {
      await loadStatus();
      setupRealtimeSubscription();
      startPolling();
      startExpirationCheck();
    } else {
      stop();
      status.value = null;
      if (onStatusChange) {
        onStatusChange(null);
      }
    }
  }, { immediate: false });

  // Atualizar intervalos quando hasAccess ou hasTemporaryAccess muda
  watch(() => status.value?.hasTemporaryAccess, () => {
    // Reiniciar verificação de expiração quando o acesso temporário muda
    startExpirationCheck();
  });

  watch(hasAccess, () => {
    if (intervalId && user.value) {
      startPolling(); // Isso vai recriar o intervalo com o novo valor
    }
  });

  // Iniciar automaticamente se solicitado
  if (autoStart) {
    onMounted(() => {
      start();
    });
  }

  // Limpar recursos ao desmontar
  onUnmounted(() => {
    stop();
  });

  return {
    // Estado
    status: onlyHasAccess ? hasAccess as Ref<boolean> : status as Ref<SubscriptionStatus | null>,
    hasAccess,
    loading,
    
    // Métodos
    loadStatus,
    start,
    stop,
    
    // Controle manual
    setupRealtimeSubscription,
    removeRealtimeSubscription,
    startPolling,
    stopPolling,
  };
}

