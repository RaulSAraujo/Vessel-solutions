<script lang="ts" setup>
const store = useEventsStore();
const {
  estimatedQuantity,
  totalCost,
  totalRevenue,
  profitMargin,
  totalPercentageDrinks,
} = storeToRefs(store);
</script>

<template>
  <v-toolbar
    density="compact"
    rounded="b-xl"
    color="transparent"
    border="t-thin"
  >
    <template #title>
      <div class="d-flex ga-4">
        <div class="d-flex align-center">
          <span class="text-button mr-1">Quantidade estimada:</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ estimatedQuantity }}
          </span>
        </div>

        <div class="d-flex align-center">
          <span class="text-button mr-1">Total (%):</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ totalPercentageDrinks }}%
          </span>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
          <span class="text-button mr-1">Custo total:</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ formatCurrency(totalCost) }}
          </span>
        </div>

        <div class="d-flex align-center">
          <span class="text-button mr-1">Receita total:</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ formatCurrency(totalRevenue) }}
          </span>
        </div>

        <div class="d-flex align-center mr-4">
          <span class="text-button mr-1">Margem de lucro:</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ profitMargin || 0 }}%
          </span>
        </div>
      </div>
    </template>
  </v-toolbar>
</template>
