<script lang="ts" setup>
import { profileSchema } from "~/schemas/profile";
import { useProfileApi } from "~/composables/api/useProfileApi";

import type { User } from "@supabase/supabase-js";

// Components
import Form from "./Form.vue";
import AvatarSection from "./AvatarSection.vue";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const { loading, errorMessage, updateProfile, uploadAvatar, removeAvatar } =
  useProfileApi();

// Formulário de perfil
const { handleSubmit, isSubmitting, meta, errors } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    full_name: props.user.user_metadata?.full_name || "",
    phone: props.user.user_metadata?.phone || "",
    avatar_url: props.user.user_metadata?.avatar_url || "",
  },
});

const { value: fullName } = useField<string>("full_name");
const { value: phone } = useField<string>("phone");
const { value: avatarUrl } = useField<string>("avatar_url");

// Função para lidar com o upload do avatar
const handleAvatarUpload = async (file: File) => {
  // Upload do arquivo
  const uploadedUrl = await uploadAvatar(file);

  if (uploadedUrl) {
    avatarUrl.value = uploadedUrl;

    $toast().success("Avatar atualizado com sucesso!");
  }
};

// Função para remover avatar
const handleRemoveAvatar = async () => {
  const success = await removeAvatar();

  if (success) {
    $toast().success("Avatar removido com sucesso!");
  } else {
    $toast().error("Erro ao remover avatar");
  }

  if (avatarUrl.value) {
    avatarUrl.value = "";
  }
};

// Submissão do formulário de perfil
const onProfileSubmit = handleSubmit(async (values) => {
  const success = await updateProfile({
    full_name: values.full_name,
    phone: values.phone,
  });

  if (success) {
    $toast().success("Perfil atualizado com sucesso!");
  } else {
    $toast().error(errorMessage.value || "Erro ao atualizar perfil");
  }
});
</script>

<template>
  <v-tabs-window-item value="profile">
    <div class="pa-6">
      <v-row>
        <!-- Avatar Section -->
        <v-col cols="12" md="4">
          <AvatarSection
            :avatar-url="avatarUrl"
            :full-name="fullName"
            :loading="loading"
            @upload="handleAvatarUpload"
            @remove="handleRemoveAvatar"
            @upload-success="avatarUrl = $event"
            @upload-error="$toast().error($event)"
          />
        </v-col>

        <!-- Formulário -->
        <v-col cols="12" md="8">
          <Form
            v-model:full-name="fullName"
            v-model:phone="phone"
            v-model:avatar-url="avatarUrl"
            :errors="errors"
            :loading="loading"
            :is-submitting="isSubmitting"
            :is-valid="meta.valid"
            @submit="onProfileSubmit"
          />
        </v-col>
      </v-row>
    </div>
  </v-tabs-window-item>
</template>
