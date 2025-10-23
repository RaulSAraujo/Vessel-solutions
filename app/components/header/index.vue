<script lang="ts" setup>
import Menu from "./Menu.vue";
import Avatar from "./Avatar.vue";
import MobileDrawer from "./MobileDrawer.vue";

// Estado para controlar o drawer mobile
const drawerMobile = ref(false);

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
        title: "Categorias",
        to: "/categories",
        icon: "mdi-nutrition",
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

    <Avatar />
  </v-app-bar>

  <!-- Drawer mobile -->
  <MobileDrawer v-model="drawerMobile" :menus="menus" />
</template>
