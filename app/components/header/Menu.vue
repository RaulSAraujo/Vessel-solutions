<script lang="ts" setup>
const menus = [
  {
    title: "Cadastro",
    items: [
      {
        title: "Clientes",
        to: "/client",
        icon: "mdi-account-group",
      },
      {
        title: "Ingredientes",
        to: "/ingredient",
        icon: "mdi-food-variant",
      },
      {
        title: "Fornecedores",
        to: "/supplier",
        icon: "mdi-truck-delivery",
      },
      {
        title: "Cotações",
        to: "/quotation",
        icon: "mdi-handshake",
      },
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
