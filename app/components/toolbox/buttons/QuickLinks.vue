<script lang="ts" setup>
import ToolboxButton from "./Button.vue";

interface QuickLink {
  tooltip: string;
  icon: string;
  to: string;
}

const quickLinks: QuickLink[] = [
  {
    tooltip: "Novo Evento",
    icon: "mdi-calendar-plus",
    to: "/events",
  },
  {
    tooltip: "Nova Cotação",
    icon: "mdi-file-document",
    to: "/quotations",
  },
  {
    tooltip: "Nova Bebida",
    icon: "mdi-glass-cocktail",
    to: "/drinks",
  },
  {
    tooltip: "Novo Cliente",
    icon: "mdi-account-plus",
    to: "/clients",
  },
];
</script>

<template>
  <ToolboxButton
    v-for="link in quickLinks"
    :key="link.to"
    :tooltip="link.tooltip"
    :icon="link.icon"
    :to="link.to"
  />
</template>
