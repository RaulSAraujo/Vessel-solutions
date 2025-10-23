<script lang="ts" setup>
defineProps<{
  status: string;
}>();

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "warning";
    case "purchased":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "grey";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pendente";
    case "purchased":
      return "Comprado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}
</script>

<template>
  <v-chip
    :color="getStatusColor(status)"
    size="small"
    variant="flat"
    class="text-white"
  >
    {{ getStatusText(status) }}
  </v-chip>
</template>
