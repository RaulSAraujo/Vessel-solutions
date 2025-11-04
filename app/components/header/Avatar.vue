<script lang="ts" setup>
import { useAuthApi } from "~/composables/api/useAuthApi";
import LogoVessel from "~/assets/images/logo-vessel.png";

const theme = useTheme();
const useAuth = useAuthApi();
const user = useSupabaseUser();

const logout = async () => {
  await useAuth.logout();
  await navigateTo("/");
};

// Computed para obter a URL do avatar ou undefined
const avatarUrl = computed(() => {
  if (!user.value) return undefined;
  const url = user.value.user_metadata?.avatar_url;
  return url && url.trim() !== "" ? url : undefined;
});

// Computed para as iniciais do usuário
const userInitials = computed(() => {
  if (!user.value) return "";
  
  const name =
    user.value.user_metadata?.full_name ||
    user.value.email?.split("@")[0] ||
    "U";
  
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>

<template>
  <v-menu location="bottom end" offset="15">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="mr-5">
        <v-avatar
          v-if="avatarUrl"
          size="large"
          :image="avatarUrl || LogoVessel"
          :class="[
            theme.current.value.dark && !avatarUrl ? 'logo-vessel-dark' : ''
          ]"
          class="opacity-80"
        />

        <v-avatar
          v-else
          size="large"
          :text="userInitials"
          class="opacity-80 text-white border-sm"
        />
      </v-btn>
    </template>

    <v-card width="250" rounded="lg">
      <v-list density="compact" lines="one">
        <v-list-item title="Perfil" prepend-icon="mdi-account" to="/profile" />

        <v-divider />

        <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.logo-vessel-dark {
  filter: invert(87%) grayscale(100%);
}
</style>
