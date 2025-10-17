<script lang="ts" setup>
import type { TableDrinks } from "~/types/event-drinks";

const props = defineProps({
  item: {
    type: Object as PropType<TableDrinks>,
    required: true,
  },
  drinks: {
    type: Array as PropType<TableDrinks[]>,
    required: true,
  },
});

/**
 * Calcula a porcentagem máxima permitida para um drink específico,
 * garantindo que a soma total de todos os drinks não exceda 100%.
 *
 * @param {object} item - O objeto do drink que está sendo editado (contém drink_percentage).
 * @returns {number} - O valor máximo que o input de porcentagem pode aceitar para este drink.
 */
const getMaxPercentageForInput = () => {
  // Verifica se o store e os drinks estão disponíveis
  if (!props.item || !props.drinks) {
    return 100; // Se não há drinks, o máximo é 100%
  }

  // Calcula a soma das porcentagens de TODOS os outros drinks, excluindo o 'item'.
  const sumOfOtherDrinksPercentages = props.drinks.reduce((sum, drink) => {
    if (drink !== props.item) {
      return sum + (drink.drink_percentage || 0);
    }

    return sum;
  }, 0);

  // O valor máximo que o 'item' pode ter é 100% menos a soma dos outros drinks.
  const maxAllowed = 100 - sumOfOtherDrinksPercentages;

  // Garante que o valor máximo não seja negativo (caso a soma dos outros já exceda 100%)
  // e que não exceda 100 (embora 100 - sum já cuide disso se sum for positivo).
  return Math.max(0, maxAllowed);
};
</script>

<template>
  <UiNumberField :min="0" :max="getMaxPercentageForInput()" />
</template>
