<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";

interface ActivityItem {
  id: string;
  type: "event" | "client" | "drink" | "quotation";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { mobile } = useDisplay();
const reportsApi = useReportsApi();

const loading = ref(false);
const activities = ref<ActivityItem[]>([]);

async function fetchRecentActivity() {
  loading.value = true;

  try {
    const periodParams = props.period
      ? {
          start_date: props.period.startDate,
          end_date: props.period.endDate,
        }
      : undefined;

    const res = await reportsApi.getRecentActivity(periodParams);

    if (res && res.data) {
      activities.value = res.data;
    } else {
      activities.value = [];
    }
  } catch (error) {
    console.error("Erro ao carregar atividades recentes:", error);
    activities.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchRecentActivity);

// Recarregar dados quando o período mudar
watch(() => props.period, fetchRecentActivity, { deep: true });
</script>

<template>
  <v-card
    elevation="2"
    class="border-sm"
    rounded="xl"
    :min-height="mobile ? '250' : '300'"
  >
    <v-card-title :class="mobile ? 'pa-3' : 'pa-4'" class="d-flex align-center">
      <v-icon
        icon="mdi-clock-outline"
        :class="mobile ? 'mr-1' : 'mr-2'"
        color="primary"
      />
      <span :class="mobile ? 'text-body-1' : 'text-h6'"
        >Atividades Recentes</span
      >
    </v-card-title>

    <v-card-text class="pa-0">
      <v-skeleton-loader
        v-if="loading"
        :type="
          mobile
            ? 'list-item-avatar-two-line@2'
            : 'list-item-avatar-three-line@3'
        "
      />

      <div
        v-else-if="!activities.length"
        class="d-flex flex-column align-center justify-center text-center"
        :class="mobile ? 'pa-4' : 'pa-6'"
        :style="mobile ? 'height: 200px' : 'height: 250px'"
      >
        <v-icon
          icon="mdi-information-outline"
          :size="mobile ? 36 : 48"
          color="grey"
          class="mb-2"
        />
        <p
          :class="mobile ? 'text-caption' : 'text-body-2'"
          class="text-medium-emphasis"
        >
          Nenhuma atividade recente
        </p>
      </div>

      <v-list v-else class="pa-0">
        <v-list-item
          v-for="activity in activities"
          :key="activity.id"
          :class="mobile ? 'px-2 py-2' : 'px-4 py-3'"
        >
          <template #prepend>
            <v-avatar :color="activity.color" :size="mobile ? 32 : 40">
              <v-icon :size="mobile ? 16 : 20" color="white">{{
                activity.icon
              }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title
            :class="
              mobile
                ? 'text-caption font-weight-medium'
                : 'text-body-1 font-weight-medium'
            "
          >
            {{ activity.title }}
          </v-list-item-title>

          <v-list-item-subtitle v-if="!mobile" class="text-body-2">
            {{ activity.description }}
          </v-list-item-subtitle>

          <template #append v-if="!mobile">
            <div class="text-caption text-medium-emphasis">
              {{ activity.timestamp }}
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions v-if="activities.length" :class="mobile ? 'pa-2' : 'pa-4'">
      <v-btn
        variant="text"
        color="primary"
        :size="mobile ? 'x-small' : 'small'"
        block
      >
        Ver todas as atividades
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
