<template>
  <v-sheet rounded="xl" class="toolbox-toolbar" border="sm">
    <ToolboxHandle />

    <div class="d-flex align-center justify-center gap-2 pa-2 flex-wrap">
      <!-- Tutorial -->
      <ToolboxButtonsTutorial />
      
      <!-- Toggle de Tema -->
      <ToolboxButtonsThemeToggle />

      <!-- Links Rápidos -->
      <ToolboxButtonsQuickLinks />
    </div>
  </v-sheet>
</template>

<style scoped>
.toolbox-toolbar {
  width: 100%;
  flex-shrink: 0;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
