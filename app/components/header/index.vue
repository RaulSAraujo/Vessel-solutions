<script lang="ts" setup>
import Menu from "./Menu.vue";
import Avatar from "./Avatar.vue";
import MobileDrawer from "./MobileDrawer.vue";
import type { TutorialStep } from "~/composables/useTutorialDriver";

// Estado para controlar o drawer mobile
const drawerMobile = ref(false);

// Tutorial
const tutorial = useTutorialDriver();
const { mobile } = useDisplay();
const route = useRoute();

const startTutorial = async () => {
  if (!process.client) return;

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Obter os steps do tutorial baseado na rota atual
  const routePath = route.path;
  let steps: TutorialStep[] | null = null;

  // Importar e obter os steps do tutorial da página atual
  if (routePath === "/dashboard") {
    const { dashboardTutorialSteps } = await import("~/data/tutorials/dashboard");
    steps = dashboardTutorialSteps(mobile.value);
  }
  // Aqui podem ser adicionados outros tutoriais para outras páginas
  // else if (routePath === "/quotations") {
  //   const { quotationsTutorialSteps } = await import("~/data/tutorials/quotations");
  //   steps = quotationsTutorialSteps(mobile.value);
  // }

  if (steps) {
    tutorial.startTutorial(steps);
  }
};

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
    <v-btn-group variant="plain">
      <v-btn icon="mdi-home" to="/" />

      <Menu :menus="menus" @toggle-drawer="toggleDrawer" />
    </v-btn-group>

    <v-spacer />

    <!-- Botão de ajuda/tutorial -->
    <v-btn
      icon="mdi-help"
      variant="plain"
      density="compact"
      class="mr-2"
      @click="startTutorial"
    />

    <Avatar />
  </v-app-bar>

  <!-- Drawer mobile -->
  <MobileDrawer v-model="drawerMobile" :menus="menus" />
</template>
