<script lang="ts" setup>
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
  {
    title: "Configurações",
    items: [
      {
        title: "Meu Perfil",
        to: "/profile",
        icon: "mdi-account-circle",
      },
      // {
      //   title: "Gestão de Usuários", // Opcional, se houver gerenciamento de usuários
      //   to: "/admin/users",
      //   icon: "mdi-account-multiple",
      // },
    ],
  },
];
</script>

<template>
  <v-menu v-for="(menu, index) in menus" :key="index" offset="13" scrim>
    <template #activator="{ props }">
      <v-btn v-bind="props"> {{ menu.title }} </v-btn>
    </template>

    <v-list color="primary" rounded="lg">
      <v-list-item
        v-for="(item, i) in menu.items"
        :key="i"
        :to="item.to"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
