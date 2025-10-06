<script setup lang="ts">
import { ref } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  /**
   * O valor booleano do botão (para v-model).
   */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o botão é somente leitura.
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o botão está desabilitado.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o toggle não envolve uma chamada de API e deve atualizar o v-model diretamente.
   * Quando true, 'confirm-toggle' e 'cancel-toggle' não são emitidos.
   */
  noApi: {
    type: Boolean,
    default: false,
  },
  /**
   * Se um alerta de confirmação deve ser exibido antes de alternar o valor.
   */
  enableAlert: {
    type: Boolean,
    default: false,
  },
  /**
   * Ícone para quando o valor é verdadeiro.
   */
  trueIcon: {
    type: String,
    default: "mdi-check-bold",
  },
  /**
   * Ícone para quando o valor é falso.
   */
  falseIcon: {
    type: String,
    default: "mdi-close-thick",
  },
  /**
   * Cor do botão para quando o valor é verdadeiro.
   */
  trueColor: {
    type: String,
    default: "green",
  },
  /**
   * Cor do botão para quando o valor é falso.
   */
  falseColor: {
    type: String,
    default: "red",
  },
  /**
   * Tamanho do botão.
   */
  size: {
    type: String,
    default: "30",
  },
  /**
   * Variante do botão.
   */
  variant: {
    type: String as PropType<
      "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"
    >,
    default: "text",
  },
  /**
   * Arredondamento do alerta.
   */
  snackbarRounded: {
    type: [Boolean, String, Number],
    default: "lg",
  },
  /**
   * Tempo de exibição do alerta.
   */
  snackbarTimeout: {
    type: [Number, String],
    default: 6000, // 6 segundos
  },
  /**
   * Cor do alerta.
   */
  snackbarColor: {
    type: String,
    default: "blue",
  },
  /**
   * Localização do alerta.
   */
  snackbarLocation: {
    type: String as PropType<
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top left"
      | "top right"
      | "bottom left"
      | "bottom right"
    >,
    default: "top",
  },
  /**
   * Classe CSS para o conteúdo do alerta.
   */
  snackbarContentClass: {
    type: String,
    default: "border-thin",
  },
  /**
   * Mensagem do alerta.
   */
  snackbarMessage: {
    type: String,
    default: "Deseja atualizar?",
  },
  /**
   * Texto do botão de confirmação.
   */
  snackbarConfirmText: {
    type: String,
    default: "Sim",
  },
  /**
   * Texto do botão de cancelamento.
   */
  snackbarCancelText: {
    type: String,
    default: "Não",
  },
  /**
   * Cor do botão de confirmação.
   */
  snackbarConfirmColor: {
    type: String,
    default: "white",
  },
  /**
   * Cor do botão de cancelamento.
   */
  snackbarActionColor: {
    type: String,
    default: "white",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "confirm-toggle",
  "cancel-toggle",
]);

const snackbar = ref(false);
const currentTime = ref(0);

/**
 * Lida com o clique no botão.
 * Se `enableAlert` for verdadeiro, abre o snackbar de confirmação.
 * Caso contrário, tenta alternar o valor diretamente.
 */
const handleClick = () => {
  if (props.readonly || props.disabled) return; // Não faz nada se estiver readonly ou disabled

  if (props.enableAlert) {
    snackbar.value = true;
  } else {
    // Se não há alerta, emite o evento para o pai lidar com a atualização
    triggerAction(!props.modelValue);
  }
};

/**
 * Emite o evento de toggle apropriado para o componente pai.
 * O pai é responsável por atualizar o `modelValue` se `noApi` for falso.
 */
const triggerAction = (newValue: boolean) => {
  if (props.noApi) {
    emit("update:modelValue", newValue); // Atualiza o v-model diretamente
  } else {
    // Emite o novo valor que o pai deve tentar aplicar via API
    emit("confirm-toggle", newValue);
  }
};

/**
 * Lida com a confirmação no snackbar.
 */
const handleConfirm = () => {
  snackbar.value = false;
  triggerAction(!props.modelValue); // Tenta alternar o valor após a confirmação
};

/**
 * Lida com o cancelamento no snackbar.
 */
const handleCancel = () => {
  snackbar.value = false;
  // Emite 'cancel-toggle' apenas se não estiver no modo 'noApi' ou 'exportSave'
  if (!props.noApi) {
    emit("cancel-toggle"); // Informa ao pai que o toggle foi cancelado
  }
};
</script>

<template>
  <div>
    <v-btn
      :size="size"
      v-bind="$attrs"
      :variant="variant"
      :readonly="readonly"
      :disabled="disabled"
      :icon="modelValue ? trueIcon : falseIcon"
      :color="modelValue ? trueColor : falseColor"
      @click="handleClick"
    />

    <v-snackbar
      v-model="snackbar"
      :rounded="snackbarRounded"
      :timeout="snackbarTimeout"
      :timer="`${currentTime}`"
      :color="snackbarColor"
      :location="snackbarLocation"
      :content-class="snackbarContentClass"
    >
      <div class="text-subtitle-1">{{ snackbarMessage }}</div>

      <template #actions>
        <v-btn
          :color="snackbarActionColor"
          variant="plain"
          @click="handleCancel"
        >
          {{ snackbarCancelText }}
        </v-btn>

        <v-btn
          :color="snackbarActionColor"
          variant="plain"
          @click="handleConfirm"
        >
          {{ snackbarConfirmText }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
