<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

const route = useRoute();
const sessionId = route.query.session_id as string;

onMounted(() => {
  // Aguardar um pouco para o webhook processar
  setTimeout(() => {
    navigateTo('/dashboard');
  }, 3000);
});
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="text-center pa-8">
          <v-icon size="64" color="success" class="mb-4">
            mdi-check-circle
          </v-icon>
          
          <h1 class="text-h4 mb-4">Pagamento Realizado com Sucesso!</h1>
          
          <p class="text-body-1 mb-6">
            Sua assinatura foi ativada. Você será redirecionado para o dashboard em alguns instantes.
          </p>

          <v-progress-circular indeterminate color="primary" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

