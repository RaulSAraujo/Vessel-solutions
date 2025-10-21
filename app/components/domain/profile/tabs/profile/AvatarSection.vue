<script setup lang="ts">
import { useProfileApi } from "~/composables/api/useProfileApi";

interface Props {
  avatarUrl: string;
  fullName: string;
  loading: boolean;
}

interface Emits {
  (e: "upload", file: File): void;
  (e: "remove"): void;
  (e: "upload-success" | "upload-error", data: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const avatarFileInput = ref<HTMLInputElement>();
const { loading: uploadLoading } = useProfileApi();

// Função para lidar com o upload do avatar
const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  // Validar tipo de arquivo
  if (!file.type.startsWith("image/")) {
    emit("upload-error", "Por favor, selecione apenas arquivos de imagem");
    return;
  }

  // Validar tamanho (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    emit("upload-error", "O arquivo deve ter no máximo 5MB");
    return;
  }

  // Emitir evento de upload iniciado
  emit("upload", file);
};

// Computed para as iniciais do nome
const userInitials = computed(() => {
  return props.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// Computed para a URL da imagem
const imageUrl = computed(() => props.avatarUrl);
</script>

<template>
  <v-card
    variant="elevated"
    elevation="2"
    class="avatar-card border-sm pa-6"
    rounded="xl"
  >
    <div class="text-center">
      <div class="avatar-container mb-4">
        <v-avatar
          size="140"
          :image="imageUrl"
          :text="userInitials"
          class="avatar-image text-h3 font-weight-bold elevation-4"
        />

        <!-- Overlay para upload -->
        <div
          v-if="!uploadLoading"
          class="avatar-overlay"
          @click="avatarFileInput?.click()"
        >
          <v-icon icon="mdi-camera" size="24" color="white" />
        </div>
      </div>

      <h3 class="text-h6 font-weight-medium mb-2">Foto do Perfil</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{
          !imageUrl
            ? "Clique na foto para alterar"
            : "Remova a foto para alterar"
        }}
      </p>

      <div class="d-flex flex-column gap-2">
        <v-btn
          v-if="avatarUrl"
          color="error"
          variant="outlined"
          size="small"
          block
          class="mt-3"
          :loading="uploadLoading"
          :disabled="uploadLoading"
          @click="$emit('remove')"
        >
          <v-icon icon="mdi-delete" class="mr-2" />
          Remover Foto
        </v-btn>
      </div>

      <input
        ref="avatarFileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleAvatarUpload"
      />
    </div>
  </v-card>
</template>

<style scoped>
/* Avatar Section */
.avatar-card {
  animation: fadeInUp 0.6s ease-out;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-image {
  transition: all 0.3s ease;
  border: 4px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-container:hover .avatar-image {
  transform: scale(1.05);
}

/* Hover effects para botões */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .avatar-image {
    width: 100px !important;
    height: 100px !important;
  }
}
</style>
