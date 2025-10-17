<script lang="ts" setup>
const store = useEventsStore();
const {
  estimatedQuantity,
  totalCost,
  totalRevenue,
  profitMargin,
  totalPercentageDrinks,
  staffCost,
  fuelCost,
  totalCostWithStaffAndFuel,
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

        <v-tooltip location="top">
          <template #activator="{ props }">
            <div v-bind="props" class="d-flex align-center">
              <span class="text-button mr-1">Custo total:</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(totalCostWithStaffAndFuel) }}
              </span>
            </div>
          </template>

          <template #default>
            <p>
              <strong>Custo drinks:</strong>
              {{ formatCurrency(totalCost) }}
            </p>
            <p>
              <strong>Custo staff:</strong>
              {{ formatCurrency(staffCost) }}
            </p>
            <p>
              <strong>Custo combustível:</strong>
              {{ formatCurrency(fuelCost) }}
            </p>
          </template>
        </v-tooltip>

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
