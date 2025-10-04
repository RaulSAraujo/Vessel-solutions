<script setup lang="ts">
defineProps<{
  text: string;
}>();

const textSpan = ref<HTMLElement | null>(null);
const isTruncated = ref(false);

const checkTruncation = () => {
  if (textSpan.value) {
    isTruncated.value = textSpan.value.scrollWidth > textSpan.value.clientWidth;
  }
};

onMounted(() => {
  nextTick(() => {
    checkTruncation();
  });
});
</script>

<template>
  <v-tooltip :text="text" location="bottom" :disabled="!isTruncated">
    <template #activator="{ props }">
      <span v-bind="props" ref="textSpan" class="no-wrap-content">
        {{ text }}
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped>
.no-wrap-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
