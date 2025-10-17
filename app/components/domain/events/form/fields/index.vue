<script lang="ts" setup>
import type { Datum as Event } from "~/types/events";

// components
import ClientAndEvent from "./ClientAndEvent.vue";
import StaffAndFuel from "./StaffAndFuel.vue";

defineProps<{
  event?: Event | null;
  errors: Partial<Record<string, string | undefined>>;
}>();
</script>

<template>
  <div>
    <ClientAndEvent :event="event" :errors="errors" />

    <div class="d-flex flex-row align-center my-4">
      <span class="text-h6">Custos de Staff e Combustível</span>
    </div>

    <StaffAndFuel :event="event" :errors="errors" />
  </div>
</template>
