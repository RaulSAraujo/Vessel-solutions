<script setup lang="ts">
interface DistributionItem {
  label: string;
  value: number;
  total: number;
  color: string;
}

interface Props {
  items: DistributionItem[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const getPercentage = (value: number, total: number) => {
  return total > 0 ? (value / total) * 100 : 0;
};
</script>

<template>
  <div class="pa-3 rounded-lg">
    <div class="text-body-2 font-weight-medium mb-3">Distribuição</div>

    <div v-if="loading" class="d-flex justify-center py-4">
      <v-progress-circular indeterminate color="primary" size="24" />
    </div>

    <div v-else>
      <div v-for="item in items" :key="item.label" class="mb-3">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption">{{ item.label }}</span>
          <span
            :class="['text-body-2 font-weight-medium', `text-${item.color}`]"
          >
            {{ item.value }}
            ({{ getPercentage(item.value, item.total).toFixed(0) }}%)
          </span>
        </div>
        <v-progress-linear
          :model-value="getPercentage(item.value, item.total)"
          :color="item.color"
          height="6"
          rounded
        />
      </div>
    </div>
  </div>
</template>
