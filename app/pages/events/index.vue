<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-calendar-check" />
      <span class="text-h5">Gerenciamento de eventos</span>
    </div>

    <EventsFilter v-model="filterDrawer" />

    <EventsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

    <EventsCreation v-model="dialogCreation" @close="dialogCreation = false" />

    <EventsUpdate v-model="dialogUpdate" @close="dialogUpdate = false" />

    <EventsDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
