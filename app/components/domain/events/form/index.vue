<script setup lang="ts">
import { eventSchema } from "~/schemas/event";
import type { Datum } from "~/types/events";
import type { Datum as Client } from "~/types/clients";

import FindClient from "./FindClient.vue";
import Status from "./Status.vue";

const props = defineProps<{
  event?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const client = ref<string | Client | null>(null);

const { handleSubmit, errors } = useForm({
  validationSchema: eventSchema,
});

const { value: clientId } = useField<string | null>("client_id");
const { value: location } = useField<string>("location");
const { value: startTime } = useField<Date>("start_time");
const { value: endTime } = useField<Date>("end_time");
const { value: guestCount } = useField<number>("guest_count");
const { value: distance } = useField<number>("distance");
const { value: audienceProfile } = useField<string>("audience_profile");
const { value: status } = useField<string | null>("status");
const { value: notes } = useField<string | null>("notes");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.event) {
  clientId.value = props.event.client_id;
  location.value = props.event.location;
  startTime.value = props.event.start_time;
  endTime.value = props.event.end_time;
  guestCount.value = props.event.guest_count;
  distance.value = props.event.distance;
  audienceProfile.value = props.event.audience_profile;
  status.value = props.event.status;
  notes.value = props.event.notes;
}

watch(client, (value) => {
  if (value && typeof value === "object") {
    clientId.value = value.id;
  } else {
    clientId.value = null;
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense justify="center">
      <v-col cols="12" md="3">
        <FindClient v-model="client" :error-messages="errors.client_id" />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          :model-value="(client as Client)?.name || ''"
          label="Nome completo"
          prepend-inner-icon="mdi-account"
          :disabled="true"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiTextField
          :model-value="(client as Client)?.phone || ''"
          label="Telefone"
          :disabled="true"
          prepend-inner-icon="mdi-phone"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiTextField
          :model-value="(client as Client)?.phone_optional || ''"
          label="Telefone opcional"
          :disabled="true"
          prepend-inner-icon="mdi-phone"
        />
      </v-col>

      <v-col cols="12" md="2">
        <Status v-model="status" :error-messages="errors.status" />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="location"
          label="Endereço completo"
          prepend-inner-icon="mdi-map-marker"
          :error-messages="errors.location"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiTextField
          v-model="startTime"
          v-maska="'##/##/#### ##:##'"
          label="Inicio do evento"
          placeholder="__/__/____ __:__"
          :error-messages="errors.start_time"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiTextField
          v-model="endTime"
          v-maska="'##/##/#### ##:##'"
          label="Final do evento"
          placeholder="__/__/____ __:__"
          :error-messages="errors.end_time"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiTextField
          v-model="guestCount"
          label="Número de Convidados"
          prepend-inner-icon="mdi-account-group"
          :error-messages="errors.guest_count"
        />
      </v-col>

      <v-col cols="12" md="2">
        <UiSelectField
          v-model="audienceProfile"
          label="Perfil"
          :items="['Perfil 1', 'Perfil 2', 'Perfil 3']"
          :error-messages="errors.audience_profile"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="notes"
          label="Observação"
          prepend-inner-icon="mdi-comment"
        />
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
