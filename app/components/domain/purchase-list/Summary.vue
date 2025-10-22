<script lang="ts" setup>
import type { PurchaseListSummary } from "../../../types/purchase-list";

const props = defineProps<{
  summary: PurchaseListSummary;
}>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getProgressPercentage() {
  if (props.summary.total_items === 0) return 0;
  return Math.round(
    (props.summary.purchased_items / props.summary.total_items) * 100
  );
}
</script>

<template>
  <v-row>
    <!-- Total de Itens -->
    <v-col cols="12" sm="6" md="3">
      <v-card color="primary" variant="flat" rounded="xl">
        <v-card-text class="text-center">
          <v-icon size="40" class="mb-2" icon="mdi-cart" />
          <div class="text-h4 font-weight-bold">{{ summary.total_items }}</div>
          <div class="text-subtitle-1">Total de Itens</div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Itens Pendentes -->
    <v-col cols="12" sm="6" md="3">
      <v-card color="warning" variant="flat" rounded="xl">
        <v-card-text class="text-white text-center">
          <v-icon size="40" class="mb-2" icon="mdi-clock-outline" />
          <div class="text-h4 font-weight-bold">
            {{ summary.pending_items }}
          </div>
          <div class="text-subtitle-1">Pendentes</div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Itens Comprados -->
    <v-col cols="12" sm="6" md="3">
      <v-card color="success" variant="flat" rounded="xl">
        <v-card-text class="text-white text-center">
          <v-icon size="40" class="mb-2" icon="mdi-check-circle" />
          <div class="text-h4 font-weight-bold">
            {{ summary.purchased_items }}
          </div>
          <div class="text-subtitle-1">Comprados</div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Custo Total Estimado -->
    <v-col cols="12" sm="6" md="3">
      <v-card color="info" variant="flat" rounded="xl">
        <v-card-text class="text-center">
          <v-icon size="40" class="mb-2" icon="mdi-currency-usd" />
          <div class="text-h4 font-weight-bold">
            {{ formatCurrency(summary.total_estimated_cost) }}
          </div>
          <div class="text-subtitle-1">Custo Estimado</div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Progresso Geral -->
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2" icon="mdi-progress-check" />
          Progresso das Compras
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-1 mr-2">Completude:</span>
            <span class="text-h6 font-weight-bold"
              >{{ getProgressPercentage() }}%</span
            >
          </div>

          <v-progress-linear
            :model-value="getProgressPercentage()"
            color="success"
            height="20"
            rounded
          >
            <template #default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>

          <div class="d-flex justify-space-between mt-2 text-caption">
            <span
              >{{ summary.purchased_items }} de {{ summary.total_items }} itens
              comprados</span
            >
            <span v-if="summary.cancelled_items > 0" class="text-warning">
              {{ summary.cancelled_items }} cancelados
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
