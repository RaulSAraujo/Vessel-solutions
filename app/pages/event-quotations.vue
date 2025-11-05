<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "subscription"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
const dialogConvert = ref(false);
</script>

<template>
  <v-container fluid>
    <div id="tutorial-event-quotations-header" class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-file-document-multiple" />
      <span class="text-h5">Propostas e orçamentos</span>
    </div>

    <EventQuotationsFilter v-model="filterDrawer" />

    <div id="tutorial-event-quotations-table">
    <EventQuotationsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
      @open-convert="dialogConvert = true"
    />
    </div>

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
    />
  </v-container>
</template>
