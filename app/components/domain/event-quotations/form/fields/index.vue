<script lang="ts" setup>
import type { EventQuotation } from "~/types/event-quotations";

// components
import StaffAndFuel from "./StaffAndFuel.vue";
import ClientAndEvent from "./ClientAndEvent.vue";

defineProps<{
  eventQuotation?: EventQuotation | null;
  errors: Partial<Record<string, string | undefined>>;
}>();
</script>

<template>
  <div>
    <ClientAndEvent :event-quotation="eventQuotation" :errors="errors" />

    <div class="d-flex flex-row align-center my-4">
      <span class="text-h6">Custos de Staff e Combustível</span>
    </div>

    <StaffAndFuel :event-quotation="eventQuotation" :errors="errors" />
  </div>
</template>
