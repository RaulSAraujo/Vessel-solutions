<script lang="ts" setup>
defineProps<{
  status: string;
}>();

const getStatusIcon = (status: string) => {
  switch (status) {
    case "proposal":
      return "mdi-file-document";
    case "confirmed":
      return "mdi-check-circle";
    case "in_progress":
      return "mdi-progress-clock";
    case "completed":
      return "mdi-check-circle-outline";
    case "cancelled":
      return "mdi-cancel";
    case "purchase":
      return "mdi-cart";
    default:
      return "mdi-help-circle"; // Ícone padrão para status desconhecido
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "proposal":
      return "blue";
    case "confirmed":
      return "green";
    case "in_progress":
      return "orange";
    case "completed":
      return "cyan";
    case "cancelled":
      return "red";
    case "purchase":
      return "purple";
    default:
      return "black"; // Cor padrão para status desconhecido
  }
};

const getText = (status: string) => {
  switch (status) {
    case "proposal":
      return "Proposta";
    case "confirmed":
      return "Confirmado";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    case "purchase":
      return "Comprar";
    default:
      return "Desconhecido"; // Texto padrão para status desconhecido
  }
};
</script>

<template>
  <span>
    <v-icon :color="getStatusColor(status)" :icon="getStatusIcon(status)" />

    {{ getText(status) }}
  </span>
</template>
