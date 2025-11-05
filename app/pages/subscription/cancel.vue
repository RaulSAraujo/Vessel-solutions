<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="text-center pa-8">
          <v-icon size="64" color="warning" class="mb-4">
            mdi-cancel
          </v-icon>
          
          <h1 class="text-h4 mb-4">Pagamento Cancelado</h1>
          
          <p class="text-body-1 mb-6">
            O pagamento foi cancelado. Você pode tentar novamente a qualquer momento.
          </p>

          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            to="/profile?tab=subscription"
          >
            Tentar Novamente
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

