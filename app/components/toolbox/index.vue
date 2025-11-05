<script lang="ts" setup>
const isHovered = ref(false);

// Estado para controlar a posição da barra
const toolbarClass = computed(() => ({
  "toolbar-hovered": isHovered.value,
  "toolbar-hidden": !isHovered.value,
}));

// Usar VueUse para gerenciar timeout com debounce
const { start, stop } = useTimeoutFn(() => {
  isHovered.value = false;
}, 500);

const handleMouseEnter = () => {
  // Parar timeout se existir
  stop();
  isHovered.value = true;
};

const handleMouseLeave = () => {
  // Iniciar timeout para esconder após delay
  start();
};
</script>

<template>
  <!-- Contêiner com zona de tolerância para evitar piscar -->
  <div
    class="toolbox-container"
    :class="toolbarClass"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <ToolboxContent />

    <ToolboxToleranceZone />
  </div>
</template>

<style scoped>
.toolbox-container {
  position: fixed;
  left: 50%;
  width: 300px;
  z-index: 1000;
  transform: translateX(-50%);
  max-width: calc(100% - 48px);
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  pointer-events: auto;
}

/* Quando não está em hover, fica parcialmente visível na parte inferior */
.toolbox-container.toolbar-hidden {
  bottom: -90px;
  opacity: 0.6;
}

/* Quando está em hover, sobe para cima */
.toolbox-container.toolbar-hovered {
  bottom: -10px;
  opacity: 1;
}

.toolbox-container.toolbar-hovered :deep(.toolbox-toolbar) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

/* Transição suave para mobile também */
@media (max-width: 600px) {
  .toolbox-container {
    width: calc(100% - 32px);
    max-width: 400px;
  }
}
</style>

