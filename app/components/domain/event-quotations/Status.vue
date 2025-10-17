<script lang="ts" setup>
import type { EventQuotationStatus } from "~/types/event-quotations";

interface Props {
  status: EventQuotationStatus;
}

const props = defineProps<Props>();

const statusConfig = {
  draft: {
    color: "deep-purple",
    icon: "mdi-pencil",
    text: "Rascunho",
  },
  sent: {
    color: "primary",
    icon: "mdi-send",
    text: "Enviado",
  },
  approved: {
    color: "green",
    icon: "mdi-check",
    text: "Aprovado",
  },
  rejected: {
    color: "red",
    icon: "mdi-close",
    text: "Rejeitado",
  },
  converted: {
    color: "purple",
    icon: "mdi-check-circle",
    text: "Convertido",
  },
};

const config = computed(() => statusConfig[props.status]);
</script>

<template>
  <v-chip
    :color="config.color"
    :prepend-icon="config.icon"
    size="small"
    variant="flat"
  >
    {{ config.text }}
  </v-chip>
</template>
