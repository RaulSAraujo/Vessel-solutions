<script lang="ts" setup>
defineProps<{
  status: string;
}>();

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Proposta":
      return "mdi-file-document";
    case "Confirmado":
      return "mdi-check-circle";
    case "Em andamento":
      return "mdi-progress-clock";
    case "Concluído":
      return "mdi-check-circle-outline";
    case "Cancelado":
      return "mdi-cancel";
    default:
      return "mdi-help-circle"; // Ícone padrão para status desconhecido
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Proposta":
      return "blue";
    case "Confirmado":
      return "green";
    case "Em andamento":
      return "orange";
    case "Concluído":
      return "cyan";
    case "Cancelado":
      return "red";
    default:
      return "black"; // Cor padrão para status desconhecido
  }
};
</script>

<template>
  <span>
    <v-icon :color="getStatusColor(status)" :icon="getStatusIcon(status)" />

    {{ status }}
  </span>
</template>
