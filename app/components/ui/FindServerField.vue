<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
const supabase = useSupabaseClient();

const props = defineProps({
  /**
   * O valor selecionado do combobox (para v-model).
   * Pode ser um único item, um array de itens, ou null/undefined.
   */
  modelValue: {
    type: [String, Number, Object, Array, null] as PropType<any | any[] | null>, // eslint-disable-line @typescript-eslint/no-explicit-any
    default: null,
  },
  /**
   * O rótulo (label) do combobox.
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * Propriedade do item a ser usada como título.
   */
  itemTitle: {
    type: [String, null],
    default: "text",
  },
  /**
   * Propriedade do item a ser usada como valor.
   */
  itemValue: {
    type: [String, null],
    default: "value",
  },
  /**
   * Se o combobox deve ter um botão de limpar.
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o combobox permite múltiplas seleções.
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o menu deve estar aberto por padrão.
   */
  menuOpenDefault: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o v-model deve retornar o objeto completo do item ou apenas o item-value.
   */
  returnObject: {
    type: Boolean,
    default: false,
  },
  /**
   * O texto de placeholder do combobox.
   */
  placeholder: {
    type: String,
    default: undefined,
  },
  /**
   * Comportamento de auto-seleção do primeiro item.
   */
  autoSelectFirst: {
    type: [Boolean, String] as PropType<boolean | "exact">,
    default: false,
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints).
   */
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: true,
  },
  /**
   * Densidade do campo ('default', 'comfortable', 'compact').
   */
  density: {
    type: String as PropType<"default" | "comfortable" | "compact">,
    default: "compact",
  },
  /**
   * Cor do componente.
   */
  color: {
    type: String,
    default: "primary",
  },
  /**
   * Variante visual do campo ('outlined', 'filled', 'solo', 'underlined', 'plain').
   */
  variant: {
    type: String as PropType<
      "outlined" | "filled" | "solo" | "underlined" | "plain"
    >,
    default: "outlined",
  },
  /**
   * Altura máxima do menu dropdown.
   */
  maxHeightMenu: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: "200",
  },
  /**
   * Define a borda arredondada.
   */
  rounded: {
    type: String,
    default: "lg",
  },
  /**
   * Nome da tabela no Supabase
   */
  tableName: {
    type: String,
    required: true,
  },
  /**
   * Campo usado para busca no Supabase
   */
  searchField: {
    type: String,
    required: true,
  },
  /**
   * Query para buscar dados no Supabase
   */
  selectQuery: {
    type: String,
    default: "*",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const debounced = refDebounced(internalValue, 700);
const loading = ref(false);
const items = ref<any[]>([]);

// Função para buscar dados no Supabase
const fetchData = async () => {
  if (props.disabled) return;

  if (!debounced.value) {
    items.value = [];
    return;
  }

  try {
    loading.value = true;

    const { data, error } = await supabase
      .from(props.tableName) // Nome da tabela
      .select(props.selectQuery)
      .ilike(props.searchField, `%${debounced.value}%`) // Busca insensível a maiúsculas/minúsculas
      .limit(10); // Limita os resultados

    if (error) {
      console.error("Erro ao buscar dados:", error.message);
    } else {
      items.value = data || [];
    }
  } catch (err) {
    console.error("Erro inesperado:", err);
  } finally {
    loading.value = false;
  }
};

// Watch para disparar a busca quando o valor debounced mudar
watch(debounced, fetchData);
</script>

<template>
  <v-combobox
    v-model="internalValue"
    :label="label"
    :items="items"
    v-bind="$attrs"
    :color="color"
    :density="density"
    :variant="variant"
    :rounded="rounded"
    autocomplete="off"
    :loading="loading"
    :multiple="multiple"
    :disabled="disabled"
    :item-title="itemTitle"
    :item-value="itemValue"
    :menu="menuOpenDefault"
    :clearable="clearable"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    :return-object="returnObject"
    :auto-select-first="autoSelectFirst"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </v-combobox>
</template>
