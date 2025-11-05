<script setup lang="ts">
const dayjs = useDayjs();

interface Props {
  expiresAt: string | null;
}

const props = defineProps<Props>();

const timeRemaining = ref<string>('');
const isExpired = ref(false);

const updateTimer = () => {
  if (!props.expiresAt) {
    timeRemaining.value = '-';
    return;
  }

  const now = dayjs();
  const expiry = dayjs(props.expiresAt);
  const diff = expiry.diff(now);

  if (diff <= 0) {
    isExpired.value = true;
    timeRemaining.value = 'Expirado';
    return;
  }

  isExpired.value = false;
  const duration = dayjs.duration(diff);
  
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (days > 0) {
    timeRemaining.value = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    timeRemaining.value = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    timeRemaining.value = `${minutes}m ${seconds}s`;
  } else {
    timeRemaining.value = `${seconds}s`;
  }
};

let intervalId: NodeJS.Timeout | null = null;

onMounted(() => {
  updateTimer();
  
  if (props.expiresAt) {
    intervalId = setInterval(() => {
      updateTimer();
    }, 1000);
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

watch(() => props.expiresAt, () => {
  updateTimer();
  
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  if (props.expiresAt) {
    intervalId = setInterval(() => {
      updateTimer();
    }, 1000);
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
      {{ isExpired ? 'Expirado' : `Faltam ${timeRemaining}` }}
    </span>
  </div>
</template>

