<script setup lang="ts">
definePageMeta({
  layout: "profile",
  middleware: ["auth"],
});

const user = useSupabaseUser();
</script>

<template>
  <div class="profile-page">
    <!-- Header com gradiente -->
    <ProfileHeader v-if="user" :user="user" />

    <!-- Conteúdo principal -->
    <v-container fluid class="pa-6">
      <v-card elevation="2" class="profile-card">
        <ProfileTabs v-if="user" :user="user" />
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
}

.profile-card {
  border-radius: 16px !important;
  overflow: hidden;
  margin-top: -40px;
  position: relative;
  z-index: 3;
}

/* Responsividade */
@media (max-width: 960px) {
  .profile-card {
    margin-top: -20px;
  }
}

@media (max-width: 600px) {
  .profile-card {
    margin-top: -10px;
  }
}
</style>
