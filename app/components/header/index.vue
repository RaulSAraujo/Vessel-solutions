<script lang="ts" setup>
import Menu from "./Menu.vue";
import Avatar from "./Avatar.vue";
import MobileDrawer from "./MobileDrawer.vue";
import { useSubscriptionApi } from '~/composables/api/useSubscriptionApi';

// Estado para controlar o drawer mobile
const drawerMobile = ref(false);

// Verificar status de acesso (inclui assinatura ativa OU acesso temporário)
const { checkSubscriptionStatus } = useSubscriptionApi();
const hasAccess = ref<boolean | null>(null);
const user = useSupabaseUser();

const loadAccessStatus = async () => {
  if (user.value) {
    try {
      const status = await checkSubscriptionStatus();
      // hasAccess já inclui tanto assinatura ativa quanto acesso temporário
      hasAccess.value = status?.hasAccess ?? false;
    } catch (error) {
      hasAccess.value = false;
    }
  } else {
    hasAccess.value = false;
  }
};

// Observar mudanças no usuário
watch(user, async (newUser) => {
  if (newUser) {
    await loadAccessStatus();
  } else {
    hasAccess.value = false;
  }
}, { immediate: true });

// Observar mudanças na rota para atualizar status quando necessário
// (útil após obter assinatura ou acesso temporário)
const route = useRoute();
watch(() => route.path, async (newPath, oldPath) => {
  // Atualizar status quando navegar para páginas relevantes
  if (newPath === '/profile' || newPath === '/subscription/success') {
    await loadAccessStatus();
  }
  // Atualizar quando sair da página de profile (útil se o acesso foi concedido)
  if (oldPath === '/profile' && newPath !== '/profile') {
    await loadAccessStatus();
  }
});

// Observar mudanças de query params no profile (quando acesso temporário é concedido)
watch(() => route.query, async (newQuery) => {
  // Se estiver na página de profile e houver mudanças, atualizar status
  if (route.path === '/profile' && (newQuery.tab === 'subscription' || newQuery.tab === 'temporary')) {
    // Aguardar um pouco para dar tempo da API processar
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadAccessStatus();
  }
});

// Atualizar status periodicamente (a cada 30 segundos) para pegar mudanças
// quando um admin concede acesso temporário
let intervalId: NodeJS.Timeout | null = null;
onMounted(() => {
  // Carregar status inicial
  loadAccessStatus();
  
  // Iniciar atualização periódica se o usuário estiver logado
  if (user.value) {
    intervalId = setInterval(() => {
      loadAccessStatus();
    }, 30000); // 30 segundos
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const menus = [
  {
    title: "Eventos",
    items: [
      {
        title: "Gerenciar Eventos",
        to: "/events",
        icon: "mdi-calendar-check",
      },
      {
        title: "Propostas e Orçamentos",
        to: "/event-quotations",
        icon: "mdi-file-document-edit",
      },
    ],
  },
  {
    title: "Cadastros",
    items: [
      {
        title: "Clientes",
        to: "/clients",
        icon: "mdi-account-group",
      },
      {
        title: "Fornecedores",
        to: "/suppliers",
        icon: "mdi-truck-delivery",
      },
      {
        title: "Ingredientes",
        to: "/ingredients",
        icon: "mdi-food-variant",
      },
      {
        title: "Drinks/Receitas",
        to: "/drinks",
        icon: "mdi-glass-cocktail",
      },
    ],
  },
  {
    title: "Compras",
    items: [
      {
        title: "Cotações",
        to: "/quotations",
        icon: "mdi-handshake",
      },
      {
        title: "Lista de Compras",
        to: "/purchase-list",
        icon: "mdi-cart",
      },
    ],
  },
  {
    title: "Relatórios",
    items: [
      {
        title: "Lucratividade de Eventos",
        to: "/profitability",
        icon: "mdi-chart-line",
      },
      {
        title: "Consumo de Ingredientes",
        to: "/ingredient-consumption",
        icon: "mdi-chart-pie",
      },
      {
        title: "Histórico de Cotações",
        to: "/quotation-history",
        icon: "mdi-history",
      },
    ],
  },
];

// Função para alternar o drawer
const toggleDrawer = () => {
  drawerMobile.value = !drawerMobile.value;
};
</script>

<template>
  <v-app-bar app>
    <v-btn-group v-if="hasAccess" variant="plain">
      <v-btn icon="mdi-home" to="/" />

      <Menu :menus="menus" @toggle-drawer="toggleDrawer" />
    </v-btn-group>

    <v-spacer />

    <Avatar />
  </v-app-bar>

  <!-- Drawer mobile -->
  <MobileDrawer v-if="hasAccess" v-model="drawerMobile" :menus="menus" />
</template>
