<script lang="ts" setup></script>

<template>
  <v-container>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-calendar-check" />
      <span class="text-h5">Novo evento</span>
    </div>

    <v-row dense>
      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Cliente" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Documento" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="E-mail" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Telefone" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="CEP" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Cidade" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Endereço" />
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <UiTextField label="Numero" />
      </v-col>
    </v-row>
  </v-container>
</template>
