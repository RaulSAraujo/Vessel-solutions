<script lang="ts" setup>
import { passwordChangeSchema } from "~/schemas/profile";
import { useProfileApi } from "~/composables/api/useProfileApi";

// Components
import Form from "./Form.vue";

const { loading, errorMessage, changePassword } = useProfileApi();

// Formulário de alteração de senha
const { handleSubmit, isSubmitting, errors, resetForm } = useForm({
  validationSchema: passwordChangeSchema,
});

// Submissão do formulário de senha
const onPasswordSubmit = handleSubmit(async (values) => {
  const success = await changePassword({
    current_password: values.current_password,
    new_password: values.new_password,
    confirm_password: values.confirm_password,
  });

  if (success) {
    $toast().success("Senha alterada com sucesso!");
    resetForm();
  } else {
    $toast().error(errorMessage.value || "Erro ao alterar senha");
  }
});
</script>

<template>
  <v-tabs-window-item value="password">
    <div class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <Form
            :errors="errors"
            :loading="loading"
            :is-submitting="isSubmitting"
            @submit="onPasswordSubmit"
          />
        </v-col>
      </v-row>
    </div>
  </v-tabs-window-item>
</template>
