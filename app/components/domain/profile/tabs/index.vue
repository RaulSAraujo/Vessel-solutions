<script setup lang="ts">
import type { User } from "@supabase/supabase-js";

// Components
import Header from "./Header.vue";
import Info from "./info/index.vue";
import Profile from "./profile/index.vue";
import Password from "./password/index.vue";
import Subscription from "./subscription/index.vue";

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

// Estados para controlar as abas
const route = useRoute();
const router = useRouter();
const activeTab = ref("profile");

// Mapeamento de abas para query params
const tabToQueryMap: Record<string, string | null> = {
  profile: null, // Não precisa de query param para a aba padrão
  password: 'password',
  info: 'info',
  subscription: 'subscription',
};

// Verificar query param para abrir aba correta
const initializeTabFromQuery = () => {
  const queryTab = route.query.tab as string;
  
  if (queryTab === 'subscription' || queryTab === 'temporary') {
    activeTab.value = 'subscription';
  } else if (queryTab === 'password') {
    activeTab.value = 'password';
  } else if (queryTab === 'info') {
    activeTab.value = 'info';
  } else {
    activeTab.value = 'profile';
  }
};

// Atualizar URL quando a aba mudar
watch(activeTab, (newTab) => {
  const queryParam = tabToQueryMap[newTab];
  
  // Se for a aba padrão (profile), remover o query param
  if (!queryParam) {
    if (route.query.tab) {
      router.replace({ query: { ...route.query, tab: undefined } });
    }
  } else {
    // Atualizar apenas o param tab, mantendo outros (como 'temporary')
    router.replace({ 
      query: { 
        ...route.query, 
        tab: queryParam 
      } 
    });
  }
});

// Observar mudanças na query string (útil para navegação direta ou botão voltar)
watch(() => route.query.tab, (newTab) => {
  initializeTabFromQuery();
});

// Inicializar ao montar
onMounted(() => {
  initializeTabFromQuery();
});
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

      <!-- Aba de Assinatura -->
      <Subscription />
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
