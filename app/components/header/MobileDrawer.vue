<script lang="ts" setup>
type Menus = {
  title: string;
  items: { title: string; to: string; icon: string }[];
}[];

// Props para controlar o drawer
interface Props {
  modelValue: boolean;
  menus: Menus;
}

const props = defineProps<Props>();

// Emits para atualizar o estado
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const { mobile } = useDisplay();

// Computed para o v-model
const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

// Função para fechar o drawer ao navegar
const closeDrawer = () => {
  drawer.value = false;
};
</script>

<template>
  <v-navigation-drawer
    v-if="mobile"
    v-model="drawer"
    :temporary="mobile"
    :permanent="!mobile"
    location="start"
    width="280"
  >
    <v-list>
      <!-- Logo/Header do drawer -->
      <v-list-item class="mb-4">
        <template #prepend>
          <v-icon icon="mdi-glass-cocktail" size="large" color="primary" />
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Vessel Solutions
        </v-list-item-title>
      </v-list-item>

      <v-divider class="mb-2" />

      <!-- Menu items -->
      <template v-for="(menu, menuIndex) in menus" :key="menuIndex">
        <!-- Título da seção -->
        <v-list-subheader class="text-uppercase font-weight-bold text-primary">
          {{ menu.title }}
        </v-list-subheader>

        <!-- Itens do menu -->
        <v-list-item
          v-for="(item, itemIndex) in menu.items"
          :key="itemIndex"
          :to="item.to"
          :prepend-icon="item.icon"
          @click="closeDrawer"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <!-- Divisor entre seções (exceto na última) -->
        <v-divider v-if="menuIndex < menus.length - 1" class="my-2" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
