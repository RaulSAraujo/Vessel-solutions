<script setup lang="ts">
interface Props {
  fullName: string;
  phone: string;
  avatarUrl: string;
  errors: Partial<Record<string, string | undefined>>;
  loading: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

interface Emits {
  (
    e: "update:fullName" | "update:phone" | "update:avatarUrl",
    value: string
  ): void;
  (e: "submit"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fullName = computed({
  get: () => props.fullName,
  set: (value) => emit("update:fullName", value),
});

const phone = computed({
  get: () => props.phone,
  set: (value) => emit("update:phone", value),
});

const handleSubmit = () => {
  emit("submit");
};
</script>

<template>
  <v-card
    variant="elevated"
    elevation="2"
    class="form-card border-sm pa-6"
    rounded="xl"
  >
    <div class="d-flex align-center mb-6">
      <v-icon icon="mdi-account-edit" size="24" class="mr-3 text-primary" />
      <h2 class="text-h5 font-weight-medium">Informações Pessoais</h2>
    </div>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <UiTextField
            v-model="fullName"
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            :error-messages="errors.full_name"
          />
        </v-col>

        <v-col cols="12" md="6">
          <UiTextField
            v-model="phone"
            v-maska="'(##) #####-####'"
            label="Telefone"
            placeholder="(__) _____-____"
            :error-messages="errors.phone"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <div class="d-flex justify-end">
        <v-btn
          type="submit"
          color="primary"
          size="large"
          variant="elevated"
          :loading="isSubmitting || loading"
          :disabled="!isValid"
          rounded="lg"
        >
          <v-icon icon="mdi-content-save" class="mr-2" />
          Salvar Alterações
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
/* Form Cards */
.form-card {
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.form-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Hover effects para botões */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Estilo para campos de entrada */
:deep(.v-field) {
  border-radius: 12px;
}

:deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 960px) {
  .form-card {
    margin-bottom: 16px;
  }
}
</style>
