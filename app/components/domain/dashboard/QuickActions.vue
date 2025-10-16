<script lang="ts" setup>
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const quickActions = ref<QuickAction[]>([
  {
    id: "1",
    title: "Novo Evento",
    description: "Criar um novo evento",
    icon: "mdi-calendar-plus",
    color: "primary",
    route: "/events",
  },
  {
    id: "2",
    title: "Adicionar Cliente",
    description: "Cadastrar novo cliente",
    icon: "mdi-account-plus",
    color: "success",
    route: "/clients",
  },
  {
    id: "3",
    title: "Nova Bebida",
    description: "Criar nova bebida",
    icon: "mdi-glass-cocktail",
    color: "warning",
    route: "/drinks",
  },
  {
    id: "4",
    title: "Nova Cotação",
    description: "Gerar cotação",
    icon: "mdi-file-document",
    color: "info",
    route: "/quotations",
  },
]);

const handleAction = (action: QuickAction) => {
  navigateTo(action.route);
};
</script>

<template>
  <v-card elevation="2" class="border-sm" rounded="xl">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-lightning-bolt" class="mr-2" color="primary" />
      Ações Rápidas
    </v-card-title>

    <v-card-text class="pa-2">
      <v-row>
        <v-col v-for="action in quickActions" :key="action.id" cols="3">
          <v-card
            :color="`${action.color}-lighten-5`"
            variant="flat"
            rounded="xl"
            class="pa-2 text-center cursor-pointer"
            @click="handleAction(action)"
          >
            <v-avatar :color="action.color" size="48" class="mb-3">
              <v-icon size="24" color="white">{{ action.icon }}</v-icon>
            </v-avatar>

            <div class="text-body-2 font-weight-medium mb-1">
              {{ action.title }}
            </div>

            <div class="text-caption text-medium-emphasis">
              {{ action.description }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
}
</style>
