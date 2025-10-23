<script lang="ts" setup>
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const { mobile } = useDisplay();

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
    <v-card-title :class="mobile ? 'pa-3' : 'pa-4'" class="d-flex align-center">
      <v-icon
        icon="mdi-lightning-bolt"
        :class="mobile ? 'mr-1' : 'mr-2'"
        color="primary"
      />
      <span :class="mobile ? 'text-body-1' : 'text-h6'">Ações Rápidas</span>
    </v-card-title>

    <v-card-text :class="mobile ? 'pa-1' : 'pa-2'">
      <v-row :dense="mobile">
        <v-col
          v-for="action in quickActions"
          :key="action.id"
          :cols="mobile ? 6 : 3"
        >
          <v-card
            variant="flat"
            rounded="xl"
            :class="['text-center cursor-pointer', mobile ? 'pa-2' : 'pa-3']"
            @click="handleAction(action)"
          >
            <v-avatar
              :color="action.color"
              :size="mobile ? 36 : 48"
              :class="mobile ? 'mb-2' : 'mb-3'"
            >
              <v-icon :size="mobile ? 18 : 24" color="white">{{
                action.icon
              }}</v-icon>
            </v-avatar>

            <div
              :class="[
                'font-weight-medium',
                mobile ? 'text-caption mb-1' : 'text-body-2 mb-1',
              ]"
            >
              {{ action.title }}
            </div>

            <div v-if="!mobile" class="text-caption text-medium-emphasis">
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
