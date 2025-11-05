<script setup lang="ts">
interface Props {
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTab = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <v-card flat class="tabs-container">
    <v-tabs v-model="activeTab" color="primary" align-tabs="start" height="64">
      <v-tab value="profile" class="tab-item">
        <v-icon icon="mdi-account-edit" class="mr-2" />
        <span class="tab-text">Informações Pessoais</span>
      </v-tab>

      <v-tab value="password" class="tab-item">
        <v-icon icon="mdi-lock-reset" class="mr-2" />
        <span class="tab-text">Segurança</span>
      </v-tab>

      <v-tab value="info" class="tab-item">
        <v-icon icon="mdi-information-outline" class="mr-2" />
        <span class="tab-text">Informações da Conta</span>
      </v-tab>

      <v-tab value="subscription" class="tab-item">
        <v-icon icon="mdi-credit-card" class="mr-2" />
        <span class="tab-text">Assinatura</span>
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<style scoped>
.tabs-container {
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.tab-item {
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

.tab-text {
  font-size: 0.9rem;
}

/* Responsividade */
@media (max-width: 600px) {
  .modern-tabs {
    height: 56px;
  }

  .tab-text {
    font-size: 0.8rem;
  }
}
</style>
