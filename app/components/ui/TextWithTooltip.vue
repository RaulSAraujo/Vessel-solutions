<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

defineProps<{
  text: string | undefined;
}>();

const textSpan = ref<HTMLElement | null>(null);
// Variável reativa para armazenar a largura atual do elemento.
// Será atualizada pelo ResizeObserver.
const currentElementWidth = ref(0);

const isTruncated = computed(() => {
  // Esta propriedade computada agora depende de `currentElementWidth`,
  // garantindo que ela seja reavaliada sempre que a largura do elemento mudar.
  if (textSpan.value) {
    // Comparamos o scrollWidth (largura total do conteúdo) com a largura visível do elemento.
    // currentElementWidth reflete a largura visível do textSpan.
    return textSpan.value.scrollWidth > currentElementWidth.value;
  }
  return false;
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Certifica-se de que o elemento `textSpan` está disponível no DOM
  if (textSpan.value) {
    // Cria uma nova instância de ResizeObserver
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Verifica se a entrada corresponde ao nosso elemento `textSpan`
        if (entry.target === textSpan.value) {
          // Atualiza a largura reativa com a nova largura do conteúdo do elemento.
          // Isso fará com que `isTruncated` seja reavaliado.
          currentElementWidth.value = entry.contentRect.width;
        }
      }
    });

    // Começa a observar o elemento `textSpan`
    resizeObserver.observe(textSpan.value);

    // Realiza uma verificação inicial após o componente ser montado e renderizado.
    // `nextTick` garante que o DOM esteja completamente atualizado e as dimensões finais estejam disponíveis.
    nextTick(() => {
      if (textSpan.value) {
        currentElementWidth.value = textSpan.value.clientWidth;
      }
    });
  }
});

onUnmounted(() => {
  // Interrompe a observação e desconecta o observador quando o componente é desmontado
  if (resizeObserver && textSpan.value) {
    resizeObserver.unobserve(textSpan.value);
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <v-tooltip :text="text" location="top" :disabled="!isTruncated">
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
