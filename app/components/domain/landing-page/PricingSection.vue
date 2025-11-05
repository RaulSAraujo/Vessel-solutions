<script lang="ts" setup>
import { useSubscriptionApi } from "~/composables/api/useSubscriptionApi";

const config = useRuntimeConfig();
const stripePublishableKey = config.public.stripePublishableKey;

// Preço ID do Stripe - configurado via variável de ambiente
const priceId = ref(
  config.public.stripePriceId || "price_1SPqCbRqS0dsHWTKABXy1sHt"
);

const { createCheckout, loading } = useSubscriptionApi();

const handleSubscribe = async () => {
  const user = useSupabaseUser();

  if (!user.value) {
    // Redirecionar para registro se não estiver logado
    await navigateTo("/auth/register");
    return;
  }

  const result = await createCheckout(priceId.value);

  if (result?.url) {
    // Redirecionar para o checkout do Stripe
    window.location.href = result.url;
  } else {
    $toast().error("Erro ao processar pagamento. Tente novamente.");
  }
};

const handleRequestAccess = async () => {
  const user = useSupabaseUser();

  if (!user.value) {
    await navigateTo("/auth/register");
    return;
  }

  await navigateTo("/profile?tab=temporary");
};
</script>

<template>
  <v-row class="py-8 py-md-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2
            :class="$vuetify.display.mobile ? 'text-h4' : 'text-h3'"
            class="mb-4"
          >
            Planos e Preços
          </h2>
          <p :class="$vuetify.display.mobile ? 'text-body-1' : 'text-h6'">
            Escolha o plano ideal para sua coquetelaria
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="6" lg="4">
          <v-card
            elevation="4"
            class="h-100 d-flex flex-column"
            rounded="lg"
            color="primary"
            variant="tonal"
          >
            <v-card-title class="text-h5 text-center pt-6">
              Acesso Temporário
            </v-card-title>

            <v-card-text class="text-center flex-grow-1">
              <div class="mb-4">
                <span class="text-h3 font-weight-bold">Sob Consulta</span>
              </div>

              <v-list density="compact" class="text-left">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="info" size="small">mdi-information</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Acesso temporário para avaliação
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="info" size="small">mdi-information</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Ideal para eventos pontuais
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="info" size="small">mdi-information</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Contato direto com nossa equipe
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                variant="elevated"
                block
                size="large"
                @click="handleRequestAccess"
              >
                Solicitar Acesso
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card elevation="4" class="h-100 d-flex flex-column" rounded="lg">
            <v-card-title class="text-h5 text-center pt-6">
              Plano Mensal
            </v-card-title>

            <v-card-text class="text-center flex-grow-1">
              <div class="mb-4">
                <span class="text-h3 font-weight-bold">R$ 99</span>
                <span class="text-body-1">/mês</span>
              </div>

              <v-list density="compact" class="text-left">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="success" size="small"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title class="text-body-2">
                    Gestão completa de eventos
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="success" size="small"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title class="text-body-2">
                    Controle de ingredientes
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="success" size="small"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title class="text-body-2">
                    Análise de lucratividade
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="success" size="small"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title class="text-body-2">
                    Suporte técnico
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="success" size="small"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title class="text-body-2">
                    Atualizações constantes
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                variant="elevated"
                block
                size="large"
                :loading="loading"
                @click="handleSubscribe"
              >
                Assinar Agora
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>
