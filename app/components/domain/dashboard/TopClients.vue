<script lang="ts" setup>
interface TopClient {
  id: string;
  name: string;
  events: number;
  totalValue: number;
  avatar?: string;
}

const topClients = ref<TopClient[]>([]);
const loading = ref(false);

async function fetchTopClients() {
  loading.value = true;

  try {
    const res = await $fetch("/api/reports/top-clients");

    if (res && res.data) {
      topClients.value = res.data;
    } else {
      topClients.value = [];
    }
  } catch (error) {
    console.error("Erro ao carregar top clientes:", error);
    topClients.value = [];
  } finally {
    loading.value = false;
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

onMounted(fetchTopClients);
</script>

<template>
  <v-card elevation="2" class="border-sm" rounded="xl" min-height="275">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-trophy" class="mr-2" color="primary" />
      Top Clientes
    </v-card-title>

    <v-card-text class="pa-0">
      <v-skeleton-loader v-if="loading" type="list-item-avatar-three-line" />

      <div v-else-if="!topClients.length" class="pa-6 text-center">
        <v-icon
          icon="mdi-account-group-outline"
          size="48"
          color="grey"
          class="mb-2"
        />
        <p class="text-body-2 text-medium-emphasis">
          Nenhum cliente encontrado
        </p>
      </div>

      <v-list v-else class="pa-0">
        <v-list-item
          v-for="(client, index) in topClients"
          :key="client.id"
          :title="client.name"
          :subtitle="`${client.events} eventos • R$ ${client.totalValue.toFixed(
            2
          )}`"
          class="px-3 py-3"
        >
          <template #prepend>
            <div class="d-flex align-center">
              <!-- Ranking Badge -->
              <v-chip
                :color="index < 3 ? 'primary' : 'grey'"
                size="small"
                variant="flat"
                class="mr-3"
                :text="`#${index + 1}`"
              />

              <!-- Avatar -->
              <v-avatar color="primary" size="35" class="mr-2">
                <span class="text-white font-weight-bold">
                  {{ getInitials(client.name) }}
                </span>
              </v-avatar>
            </div>
          </template>

          <template #append>
            <v-chip
              color="green-darken-1"
              size="small"
              variant="flat"
              :text="`R$ ${client.totalValue.toFixed(2)}`"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
