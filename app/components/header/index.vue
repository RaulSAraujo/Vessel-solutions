<script lang="ts" setup>
import Menu from "./Menu.vue";
import Avatar from "./Avatar.vue";
import MobileDrawer from "./MobileDrawer.vue";

// Estado para controlar o drawer mobile
const drawerMobile = ref(false);

// Usar composable global otimizado para gerenciar atualização em tempo real do status
// onlyHasAccess: true porque só precisamos saber se tem acesso ou não
const { hasAccess, loadStatus } = useGlobalSubscriptionRealtime({
  onlyHasAccess: true,
  autoStart: true,
});

// Observar mudanças na rota para atualizar status quando necessário
const route = useRoute();
watch(() => route.path, async (newPath, oldPath) => {
  // Atualizar status quando navegar para páginas relevantes
  if (newPath === '/profile' || newPath === '/subscription/success') {
    await loadStatus();
  }
  // Atualizar quando sair da página de profile (útil se o acesso foi concedido)
  if (oldPath === '/profile' && newPath !== '/profile') {
    await loadStatus();
  }
});

// Observar mudanças de query params no profile
watch(() => route.query, async (newQuery) => {
  if (route.path === '/profile' && (newQuery.tab === 'subscription' || newQuery.tab === 'temporary')) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadStatus();
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
      <v-btn icon="mdi-home" to="/dashboard" />

      <Menu :menus="menus" @toggle-drawer="toggleDrawer" />
    </v-btn-group>

    <v-spacer />

    <Avatar />
  </v-app-bar>

  <!-- Drawer mobile -->
  <MobileDrawer v-if="hasAccess" v-model="drawerMobile" :menus="menus" />
</template>
