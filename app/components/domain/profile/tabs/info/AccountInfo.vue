<script setup lang="ts">
interface UserInfo {
  email: string;
  createdAt: string;
  lastSignIn: string;
  emailConfirmed: string;
}

interface Props {
  userInfo: UserInfo;
}

defineProps<Props>();
</script>

<template>
  <v-row>
    <!-- Informações da Conta -->
    <v-col cols="12" md="8">
      <v-card elevation="2" class="info-card border-sm pa-6" rounded="xl">
        <div class="d-flex align-center mb-6">
          <v-icon
            icon="mdi-information-outline"
            size="24"
            class="mr-3 text-primary"
          />
          <h2 class="text-h5 font-weight-medium">Informações da Conta</h2>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="info-item border-sm pa-4 mb-4" rounded="lg">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-email" color="primary" class="mr-3" />
                <h3 class="text-subtitle-1 font-weight-medium">Email</h3>
              </div>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ userInfo.email }}
              </p>
            </v-card>

            <v-card class="info-item border-sm pa-4 mb-4" rounded="lg">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-calendar-plus" color="primary" class="mr-3" />
                <h3 class="text-subtitle-1 font-weight-medium">
                  Conta criada em
                </h3>
              </div>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ userInfo.createdAt }}
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="info-item border-sm pa-4 mb-4" rounded="lg">
              <div class="d-flex align-center mb-2">
                <v-icon
                  icon="mdi-calendar-clock"
                  color="primary"
                  class="mr-3"
                />
                <h3 class="text-subtitle-1 font-weight-medium">
                  Último acesso
                </h3>
              </div>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ userInfo.lastSignIn }}
              </p>
            </v-card>

            <v-card class="info-item border-sm pa-4 mb-4" rounded="lg">
              <div class="d-flex align-center mb-2">
                <v-icon
                  :icon="
                    userInfo.emailConfirmed === 'Sim'
                      ? 'mdi-shield-check'
                      : 'mdi-shield-alert'
                  "
                  :color="
                    userInfo.emailConfirmed === 'Sim' ? 'success' : 'warning'
                  "
                  class="mr-3"
                />
                <h3 class="text-subtitle-1 font-weight-medium">
                  Email confirmado
                </h3>
              </div>

              <v-chip
                :color="
                  userInfo.emailConfirmed === 'Sim' ? 'success' : 'warning'
                "
                variant="tonal"
                size="small"
              >
                {{ userInfo.emailConfirmed }}
              </v-chip>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Alertas e Informações -->
    <v-col cols="12" md="4">
      <v-card elevation="2" class="alerts-card border-sm pa-6" rounded="xl">
        <div class="d-flex align-center mb-4">
          <v-icon
            icon="mdi-shield-account"
            size="20"
            class="mr-2 text-primary"
          />
          <h3 class="text-h6 font-weight-medium">Segurança</h3>
        </div>

        <v-alert type="info" variant="tonal" class="mb-4" rounded="lg">
          <template #title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="16" class="mr-2" />
              Privacidade
            </div>
          </template>
          <p class="text-body-2 mt-2 mb-0">
            Suas informações pessoais são protegidas e utilizadas apenas para
            personalizar sua experiência na plataforma.
          </p>
        </v-alert>

        <v-alert type="warning" variant="tonal" class="mb-4" rounded="lg">
          <template #title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-security" size="16" class="mr-2" />
              Segurança da conta
            </div>
          </template>
          <p class="text-body-2 mt-2 mb-0">
            Mantenha sua senha segura e não a compartilhe com terceiros.
            Recomendamos alterar sua senha periodicamente.
          </p>
        </v-alert>

        <v-alert type="success" variant="tonal" rounded="lg">
          <template #title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-check-circle" size="16" class="mr-2" />
              Conta ativa
            </div>
          </template>
          <p class="text-body-2 mt-2 mb-0">
            Sua conta está ativa e funcionando normalmente. Todas as
            funcionalidades estão disponíveis.
          </p>
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Form Cards */
.info-card,
.alerts-card {
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.info-card:hover,
.alerts-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Info Items */
.info-item {
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-1px);
}

/* Estilo para alerts */
:deep(.v-alert) {
  border-radius: 12px;
}

/* Estilo para chips */
:deep(.v-chip) {
  border-radius: 8px;
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
  .info-card,
  .alerts-card {
    margin-bottom: 16px;
  }
}
</style>
