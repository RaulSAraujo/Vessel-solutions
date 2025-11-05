<script setup lang="ts">
const dayjs = useDayjs();

interface Props {
  expiresAt: string | null;
}

const props = defineProps<Props>();

// Usar VueUse para obter o tempo atual reativo (atualiza a cada segundo)
const now = useNow({ interval: 1000 });

// Calcular tempo restante
const timeRemaining = computed(() => {
  if (!props.expiresAt) {
    return null;
  }

  const expiry = dayjs(props.expiresAt);
  const diff = expiry.diff(now.value);

  if (diff <= 0) {
    return 0;
  }

  return diff;
});

// Verificar se expirou
const isExpired = computed(() => {
  return timeRemaining.value !== null && timeRemaining.value <= 0;
});

// Formatar tempo restante
const formattedTimeRemaining = computed(() => {
  if (!props.expiresAt) {
    return '-';
  }

  if (isExpired.value) {
    return 'Expirado';
  }

  if (timeRemaining.value === null) {
    return '-';
  }

  const duration = dayjs.duration(timeRemaining.value);
  
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
});
</script>

<template>
  <div class="d-flex align-center ga-2">
    <v-icon 
      :color="isExpired ? 'error' : 'warning'" 
      size="small"
      :icon="isExpired ? 'mdi-alert-circle' : 'mdi-clock-outline'"
    />
    <span 
      :class="[
        'text-body-2 font-weight-medium',
        isExpired ? 'text-error' : 'text-warning'
      ]"
    >
      {{ isExpired ? 'Expirado' : `Faltam ${formattedTimeRemaining}` }}
    </span>
  </div>
</template>

