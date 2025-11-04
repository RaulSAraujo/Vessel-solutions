<script lang="ts" setup>
const props = defineProps({
  tutorialId: {
    type: String,
    default: "",
  },
});

defineEmits(["edit", "delete"]);
</script>

<template>
  <v-menu location="end center">
    <template #activator="{ props: menuProps }">
      <v-icon
        :id="tutorialId ? `${tutorialId}-actions-icon` : undefined"
        icon="mdi-dots-vertical"
        small
        class="mr-2 tutorial-actions-icon"
        v-bind="menuProps"
      />
    </template>

    <v-list
      density="compact"
      lines="one"
      rounded="lg"
      border="sm"
      variant="plain"
    >
      <v-list-item
        :id="tutorialId ? `${tutorialId}-actions-edit` : undefined"
        title="Editar"
        base-color="primary"
        class="tutorial-actions-edit"
        @click="$emit('edit')"
      >
        <template #prepend>
          <v-icon size="small" start icon="mdi-pencil" />
        </template>
      </v-list-item>

      <v-divider />

      <v-list-item
        :id="tutorialId ? `${tutorialId}-actions-delete` : undefined"
        title="Excluir"
        base-color="error"
        class="tutorial-actions-delete"
        @click="$emit('delete')"
      >
        <template #prepend>
          <v-icon size="small" start icon="mdi-delete" />
        </template>
      </v-list-item>

      <slot name="items" />
    </v-list>
  </v-menu>
</template>
