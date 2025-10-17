<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
const dialogConvert = ref(false);
const dialogClientForm = ref(false);
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-file-document-multiple" />
      <span class="text-h5">Propostas e orçamentos</span>
    </div>

    <EventQuotationsFilter v-model="filterDrawer" />

    <EventQuotationsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
      @open-convert="dialogConvert = true"
    />

    <EventQuotationsCreation
      v-model="dialogCreation"
      @close="dialogCreation = false"
    />

    <EventQuotationsUpdate
      v-model="dialogUpdate"
      @close="dialogUpdate = false"
    />

    <EventQuotationsDelete
      v-model="dialogDelete"
      @close="dialogDelete = false"
    />

    <EventQuotationsConvert
      v-model="dialogConvert"
      @close="dialogConvert = false"
      @open-form="dialogClientForm = true"
    />

    <EventQuotationsClient
      v-model="dialogClientForm"
      @close="dialogClientForm = false"
    />
  </v-container>
</template>
