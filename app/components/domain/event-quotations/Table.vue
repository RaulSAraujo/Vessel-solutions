<script lang="ts" setup>
import type { EventQuotation } from "~/types/event-quotations";

// componentes
import Status from "./Status.vue";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useEventQuotationsStore();
const {
  page,
  itemsPerPage,
  items,
  totalItems,
  loading,
  selectedEventQuotation,
} = storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Status", key: "status", minWidth: 120 },
  { title: "Nome do Cliente", key: "client_name", minWidth: 150 },
  { title: "Email", key: "client_email", minWidth: 200 },
  { title: "Telefone", key: "client_phone", minWidth: 100, maxWidth: 120 },
  { title: "Nº de Convidados", key: "guest_count", minWidth: 150 },
  { title: "Valor Total", key: "total_value", minWidth: 120 },
  { title: "Observações", key: "notes", minWidth: 200 },
  { title: "Criado em", key: "created_at", minWidth: 120 },
  { title: "Atualizado em", key: "updated_at", minWidth: 145 },
];

function handleOpenUpdate(eventQuotation: EventQuotation) {
  selectedEventQuotation.value = eventQuotation;
  emit("openUpdate");
}

function handleOpenDelete(eventQuotation: EventQuotation) {
  selectedEventQuotation.value = eventQuotation;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de propostas e orçamentos"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchEventQuotations"
  >
    <template #buttons>
      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchEventQuotations"
      />

      <v-btn
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
        @click="$emit('openCreation')"
      />
    </template>

    <template #item.actions="{ item }">
      <UiTableActions
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      />
    </template>

    <template #item.status="{ item }">
      <Status :status="item.status" />
    </template>

    <template #item.client_name="{ item }">
      <UiTextWithTooltip :text="item.client_name" />
    </template>

    <template #item.client_email="{ item }">
      <UiTextWithTooltip :text="item.client_email" />
    </template>

    <template #item.client_phone="{ item }">
      <UiTextWithTooltip :text="item.client_phone" />
    </template>

    <template #item.notes="{ item }">
      <UiTextWithTooltip :text="item.notes" />
    </template>

    <template #item.total_value="{ item }">
      {{ formatCurrency(item.total_value) }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
