<script setup lang="ts">
import type { SubscriptionStatus } from '~/composables/api/useSubscriptionApi';

interface Props {
  status: SubscriptionStatus | null;
  loading?: boolean;
  errorMessage?: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [reason: string, contactInfo: string];
}>();

const { handleSubmit, isSubmitting, meta, errors } = useForm();
const { value: reason } = useField<string>('reason');
const { value: contactInfo } = useField<string>('contact_info');
const submitted = ref(false);

const onSubmitForm = handleSubmit(async (values) => {
  emit('submit', values.reason, values.contact_info);
  submitted.value = true;
});

watch(() => props.status, (newStatus) => {
  if (newStatus?.hasTemporaryAccess) {
    submitted.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="submitted" class="text-center pa-8">
      <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
      <h2 class="text-h5 mb-4">Solicitação Enviada!</h2>
      <p class="text-body-1 mb-6 text-medium-emphasis">
        Sua solicitação de acesso temporário foi enviada com sucesso. 
        Nossa equipe entrará em contato em breve.
      </p>
    </div>

    <div v-else>
      <v-alert type="info" variant="tonal" class="mb-6">
        <v-alert-title>O que é acesso temporário?</v-alert-title>
        <p class="mb-0 text-body-2">
          O acesso temporário é ideal para eventos pontuais ou para avaliação da plataforma. 
          Entre em contato conosco e nossa equipe avaliará sua solicitação.
        </p>
      </v-alert>

      <v-form @submit.prevent="onSubmitForm">
        <v-textarea
          v-model="reason"
          label="Motivo da solicitação"
          placeholder="Explique por que você precisa de acesso temporário..."
          :error-messages="errors.reason"
          :rules="[v => !!v || 'O motivo é obrigatório']"
          rows="4"
          class="mb-4"
          required
        />

        <v-text-field
          v-model="contactInfo"
          label="Informações de contato (opcional)"
          placeholder="Email, telefone ou outra forma de contato"
          :error-messages="errors.contact_info"
          class="mb-6"
        />

        <v-btn
          type="submit"
          color="primary"
          variant="elevated"
          size="large"
          block
          prepend-icon="mdi-send"
          :loading="isSubmitting || loading"
          :disabled="!meta.valid"
        >
          Enviar Solicitação
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

