<script lang="ts" setup>
import type { User } from "@supabase/supabase-js";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

// Computed para informações do usuário
const userDisplayName = computed(() => {
  return (
    props.user.user_metadata?.full_name ||
    props.user.email?.split("@")[0] ||
    "Usuário"
  );
});

const userInitials = computed(() => {
  const name = userDisplayName.value;
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>

<template>
  <div class="profile-header">
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="12">
          <div class="header-content">
            <div class="header-background" />

            <div class="header-overlay">
              <v-container class="py-8">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <div class="d-flex align-center mb-4">
                      <v-avatar
                        size="80"
                        :text="userInitials"
                        :image="user?.user_metadata?.avatar_url"
                        class="mr-4 text-h4 font-weight-bold text-white elevation-4"
                      />

                      <div>
                        <h1 class="text-h4 font-weight-bold text-white mb-2">
                          {{ userDisplayName }}
                        </h1>

                        <p class="text-h6 text-white text-opacity-80 mb-0">
                          {{ user?.email }}
                        </p>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="text-right">
                    <v-chip
                      color="white"
                      variant="elevated"
                      size="large"
                      class="text-primary"
                    >
                      <v-icon icon="mdi-account-check" class="mr-2" />
                      Conta Ativa
                    </v-chip>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.profile-header {
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  min-height: 200px;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1d9fc7 0%, #3f5febc7 100%);
  z-index: 1;
}

.header-overlay {
  position: relative;
  z-index: 2;
}

/* Responsividade */
@media (max-width: 960px) {
  .header-content {
    min-height: 160px;
  }
}

@media (max-width: 600px) {
  .header-content {
    min-height: 140px;
  }
}
</style>
