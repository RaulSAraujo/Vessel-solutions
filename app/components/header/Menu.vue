<script lang="ts" setup>
type Menus = {
  title: string;
  items: { title: string; to: string; icon: string }[];
}[];

defineProps<{ menus: Menus }>();

const { mobile } = useDisplay();

// Define o emit para o evento toggle-drawer
defineEmits<{
  "toggle-drawer": [];
}>();
</script>

<template>
  <!-- Menu desktop -->
  <template v-if="!mobile">
    <v-menu v-for="(menu, index) in menus" :key="index" offset="13" scrim>
      <template #activator="{ props }">
        <v-btn v-bind="props"> {{ menu.title }} </v-btn>
      </template>

      <v-list color="primary" rounded="lg">
        <v-list-item
          v-for="(item, i) in menu.items"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>

  <!-- Botão hamburger para mobile -->
  <v-btn v-if="mobile" icon="mdi-menu" @click="$emit('toggle-drawer')" />
</template>
