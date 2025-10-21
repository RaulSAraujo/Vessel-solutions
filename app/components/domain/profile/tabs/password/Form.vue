<script setup lang="ts">
interface Props {
  errors: Partial<Record<string, string | undefined>>;
  loading: boolean;
  isSubmitting: boolean;
}

interface Emits {
  (e: "submit"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { value: currentPassword } = useField<string>("current_password");
const { value: newPassword } = useField<string>("new_password");
const { value: confirmPassword } = useField<string>("confirm_password");

const handleSubmit = () => {
  emit("submit");
};
</script>

<template>
  <v-card
    variant="elevated"
    elevation="2"
    class="password-card border-sm pa-6"
    rounded="xl"
  >
    <div class="d-flex align-center mb-6">
      <v-icon icon="mdi-lock-reset" size="24" class="mr-3 text-primary" />
      <h2 class="text-h5 font-weight-medium">Alterar Senha</h2>
    </div>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12">
          <UiTextField
            v-model="currentPassword"
            label="Senha Atual"
            type="password"
            placeholder="Digite sua senha atual"
            :error-messages="errors.current_password"
            required
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <UiTextField
            v-model="newPassword"
            label="Nova Senha"
            type="password"
            placeholder="Digite sua nova senha"
            :error-messages="errors.new_password"
            required
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <UiTextField
            v-model="confirmPassword"
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Confirme sua nova senha"
            :error-messages="errors.confirm_password"
            required
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <v-alert type="info" variant="tonal" class="mb-4" rounded="lg">
            <template #title>
              <div class="d-flex align-center">
                <v-icon icon="mdi-shield-check" class="mr-2" />
                Requisitos da senha
              </div>
            </template>
            <v-list density="compact" class="mt-2">
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" size="16" color="success" />
                </template>
                <v-list-item-title class="text-body-2"
                  >Mínimo de 8 caracteres</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" size="16" color="success" />
                </template>
                <v-list-item-title class="text-body-2"
                  >Pelo menos uma letra minúscula</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" size="16" color="success" />
                </template>
                <v-list-item-title class="text-body-2"
                  >Pelo menos uma letra maiúscula</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" size="16" color="success" />
                </template>
                <v-list-item-title class="text-body-2"
                  >Pelo menos um número</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-check-circle" size="16" color="success" />
                </template>
                <v-list-item-title class="text-body-2"
                  >Pelo menos um caractere especial</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-divider class="mb-4" />
          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              variant="elevated"
              :loading="isSubmitting || loading"
              rounded="lg"
            >
              <v-icon icon="mdi-lock-reset" class="mr-2" />
              Alterar Senha
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<style scoped>
/* Form Cards */
.password-card {
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.password-card:hover {
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

/* Estilo para alerts */
:deep(.v-alert) {
  border-radius: 12px;
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
  .password-card {
    margin-bottom: 16px;
  }
}
</style>
