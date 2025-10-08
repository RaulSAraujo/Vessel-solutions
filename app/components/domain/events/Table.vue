<script lang="ts" setup>
// componentes
import type { Datum } from "~/types/events";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useEventsStore();
const { page, itemsPerPage, items, totalItems, loading, selectedEvent } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Status", key: "status" },
  { title: "Cliente", key: "clients.name", maxWidth: 100 },
  { title: "Endereço completo", key: "location", maxWidth: 150 },
  { title: "Nº de convidados", key: "guest_count", maxWidth: 120 },
  { title: "Inicio do evento", key: "start_time" },
  { title: "Final do evento", key: "end_time" },
  { title: "Distância (km)", key: "distance" },
  { title: "Perfil", key: "audience_profile" },
  { title: "Criado em", key: "created_at" },
  { title: "Atualizado em", key: "updated_at" },
];

function handleOpenUpdate(supplier: Datum) {
  selectedEvent.value = supplier;
  emit("openUpdate");
}

function handleOpenDelete(supplier: Datum) {
  selectedEvent.value = supplier;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de eventos"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchEvents"
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
        @click="store.fetchEvents"
      />

      <v-btn
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
        :to="{ name: 'events-creation' }"
      />
    </template>

    <template #item.actions="{ item }">
      <UiTableActions
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      />
    </template>

    <template #item.clients.name="{ item }">
      <UiTextWithTooltip :text="item.clients.name" />
    </template>

    <template #item.location="{ item }">
      <UiTextWithTooltip :text="item.location" />
    </template>

    <template #item.start_time="{ item }">
      {{ formatDate(item.start_time, "DD/MM [ás] HH:mm") }}
    </template>

    <template #item.end_time="{ item }">
      {{ formatDate(item.end_time, "DD/MM [ás] HH:mm") }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
