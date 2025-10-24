<script lang="ts" setup>
import { useAuthApi } from "~/composables/api/useAuthApi";
import LogoVessel from "~/assets/images/logo-vessel.png";

const theme = useTheme();
const useAuth = useAuthApi();
const user = useSupabaseUser();
const themeStore = useThemeStore();

const logout = async () => {
  await useAuth.logout();
  await navigateTo("/");
};

const handleThemeChange = async () => {
  // Alterna o tema
  theme.cycle();

  // Salva a preferência usando o Pinia store
  const currentTheme = theme.current.value.dark ? "dark" : "light";
  await themeStore.saveTheme(currentTheme, user);
};
</script>

<template>
  <v-menu location="bottom end" offset="15">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="mr-5">
        <v-avatar
          size="large"
          :image="user ? user.user_metadata.avatar_url : LogoVessel"
          :class="theme.current.value.dark ? 'logo-vessel-dark' : ''"
          class="opacity-80"
        />
      </v-btn>
    </template>

    <v-card width="200" rounded="lg">
      <v-list density="compact" lines="one">
        <v-list-item
          title="Alterar tema"
          prepend-icon="mdi-theme-light-dark"
          @click="handleThemeChange"
        />

        <v-divider />

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
