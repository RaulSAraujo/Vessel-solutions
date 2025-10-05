<script lang="ts" setup>
defineEmits(["edit", "delete"]);
</script>

<template>
  <v-menu location="end center">
    <template #activator="{ props }">
      <v-icon icon="mdi-dots-vertical" small class="mr-2" v-bind="props" />
    </template>

    <v-list
      density="compact"
      lines="one"
      rounded="lg"
      border="sm"
      variant="plain"
    >
      <v-list-item title="Editar" base-color="primary" @click="$emit('edit')">
        <template #prepend>
          <v-icon size="small" start icon="mdi-pencil" />
        </template>
      </v-list-item>

      <v-divider />

      <v-list-item title="Excluir" base-color="error" @click="$emit('delete')">
        <template #prepend>
          <v-icon size="small" start icon="mdi-delete" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
