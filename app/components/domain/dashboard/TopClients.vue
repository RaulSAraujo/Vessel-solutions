<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";

interface TopClient {
  id: string;
  name: string;
  events: number;
  totalValue: number;
  avatar?: string;
}

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { mobile } = useDisplay();
const reportsApi = useReportsApi();

const loading = ref(false);
const topClients = ref<TopClient[]>([]);

async function fetchTopClients() {
  loading.value = true;

  try {
    const periodParams = props.period
      ? {
          start_date: props.period.startDate,
          end_date: props.period.endDate,
        }
      : undefined;

    const res = await reportsApi.getTopClients(periodParams);

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

// Recarregar dados quando o período mudar
watch(() => props.period, fetchTopClients, { deep: true });
</script>

<template>
  <v-card
    elevation="2"
    class="border-sm"
    rounded="xl"
    :height="mobile ? '280' : '320'"
  >
    <v-card-title :class="mobile ? 'pa-3' : 'pa-4'" class="d-flex align-center">
      <v-icon
        icon="mdi-trophy"
        :class="mobile ? 'mr-1' : 'mr-2'"
        color="primary"
      />
      <span :class="mobile ? 'text-body-1' : 'text-h6'">Top Clientes</span>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-skeleton-loader
        v-if="loading"
        :type="
          mobile ? 'list-item-avatar-two-line' : 'list-item-avatar-three-line'
        "
      />

      <div
        v-else-if="!topClients.length"
        class="d-flex flex-column align-center justify-center text-center"
        :class="mobile ? 'pa-4' : 'pa-6'"
        :style="mobile ? 'height: 200px' : 'height: 250px'"
      >
        <v-icon
          icon="mdi-account-group-outline"
          :size="mobile ? 36 : 48"
          color="grey"
          class="mb-2"
        />
        <p
          :class="mobile ? 'text-caption' : 'text-body-2'"
          class="text-medium-emphasis"
        >
          Nenhum cliente encontrado
        </p>
      </div>

      <v-list v-else class="pa-0">
        <v-list-item
          v-for="(client, index) in topClients"
          :key="client.id"
          :title="client.name"
          :subtitle="
            mobile
              ? undefined
              : `${client.events} eventos • R$ ${client.totalValue.toFixed(2)}`
          "
          :class="mobile ? 'px-2 py-2' : 'px-3 py-3'"
        >
          <template #prepend>
            <div class="d-flex align-center">
              <!-- Ranking Badge -->
              <v-chip
                :color="index < 3 ? 'primary' : 'grey'"
                :size="mobile ? 'x-small' : 'small'"
                variant="flat"
                :class="mobile ? 'mr-2' : 'mr-3'"
                :text="`#${index + 1}`"
              />

              <!-- Avatar -->
              <v-avatar
                color="primary"
                :size="mobile ? 28 : 35"
                :class="mobile ? 'mr-1' : 'mr-2'"
              >
                <span
                  class="text-white font-weight-bold"
                  :class="mobile ? 'text-caption' : 'text-body-2'"
                >
                  {{ getInitials(client.name) }}
                </span>
              </v-avatar>
            </div>
          </template>

          <template #append v-if="!mobile">
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
