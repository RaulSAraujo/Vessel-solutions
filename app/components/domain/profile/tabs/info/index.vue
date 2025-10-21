<script lang="ts" setup>
import AccountInfo from "./AccountInfo.vue";

import type { User } from "@supabase/supabase-js";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

// Computed para exibir informações do usuário
const userInfo = computed(() => ({
  email: props.user.email || "N/A",
  createdAt: new Date(props.user.created_at).toLocaleDateString("pt-BR"),
  lastSignIn: props.user.last_sign_in_at
    ? new Date(props.user.last_sign_in_at).toLocaleDateString("pt-BR")
    : "Nunca",
  emailConfirmed: props.user.email_confirmed_at ? "Sim" : "Não",
}));
</script>

<template>
  <v-tabs-window-item value="info">
    <div class="pa-6">
      <AccountInfo :user-info="userInfo" />
    </div>
  </v-tabs-window-item>
</template>
