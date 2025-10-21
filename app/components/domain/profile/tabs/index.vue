<script setup lang="ts">
import type { User } from "@supabase/supabase-js";

// Components
import Header from "./Header.vue";
import Info from "./info/index.vue";
import Profile from "./profile/index.vue";
import Password from "./password/index.vue";

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

// Estados para controlar as abas
const activeTab = ref("profile");
</script>

<template>
  <div class="profile-view">
    <!-- Navegação com tabs modernas -->
    <Header v-model="activeTab" />

    <!-- Conteúdo das tabs -->
    <v-tabs-window v-model="activeTab" class="tabs-content">
      <!-- Aba de Informações Pessoais -->
      <Profile :user="user" />

      <!-- Aba de Alterar Senha -->
      <Password />

      <!-- Aba de Informações da Conta -->
      <Info :user="user" />
    </v-tabs-window>
  </div>
</template>

<style scoped>
.tabs-content {
  border-radius: 0 0 16px 16px;
  min-height: 500px;
}

/* Responsividade */
@media (max-width: 960px) {
  .tabs-content {
    min-height: 400px;
  }
}

@media (max-width: 600px) {
  .tabs-content {
    min-height: 350px;
  }
}
</style>
