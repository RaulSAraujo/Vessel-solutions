<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { Datum as Event } from "~/types/events";
import type { Datum as Client } from "~/types/clients";

// components
import Status from "./Status.vue";
import FindClient from "./FindClient.vue";
import AudienceProfile from "./AudienceProfile.vue";

const props = defineProps<{
  event?: Event | null;
  errors: Partial<Record<string, string | undefined>>;
}>();

const dayjs = useDayjs();
const api = useClientsApi();
const { mdAndUp } = useDisplay();

const store = useEventsStore();
const { eventDurationHours } = storeToRefs(store);

const disabledFindClient = ref(true);
const client = ref<string | Client | null>(null);

const { value: clientId } = useField<string | null>("client_id");
const { value: location } = useField<string>("location");
const { value: startTime } = useField<string>("start_time");
const { value: endTime } = useField<string>("end_time");
const { value: guestCount } = useField<number>("guest_count");

const { value: audienceProfile } = useField<string>("audience_profile");
const { value: status } = useField<string | null>("status");
const { value: notes } = useField<string | null>("notes");

watch(client, (value) => {
  if (value && typeof value === "object") {
    clientId.value = value.id;
  } else {
    clientId.value = null;
  }
});

// Watch para calcular duração do evento
watch([startTime, endTime], ([start, end]) => {
  if (
    start &&
    end &&
    dayjs(start, "DD/MM/YYYY HH:mm").isValid() &&
    dayjs(end, "DD/MM/YYYY HH:mm").isValid()
  ) {
    store.calculateEventDuration(start, end);
  }
});

onMounted(async () => {
  if (props.event) {
    location.value = props.event.location;
    startTime.value = formatDate(props.event.start_time, "DD/MM/YYYY HH:mm");
    endTime.value = formatDate(props.event.end_time, "DD/MM/YYYY HH:mm");
    guestCount.value = props.event.guest_count;
    audienceProfile.value = props.event.audience_profile;
    status.value = props.event.status;
    notes.value = props.event.notes;

    // Calcular duração do evento
    store.calculateEventDuration(
      formatDate(props.event.start_time, "DD/MM/YYYY HH:mm"),
      formatDate(props.event.end_time, "DD/MM/YYYY HH:mm")
    );

    const resClient = await api.getClientById(props.event.client_id);
    if (resClient) {
      client.value = resClient;
    }
  } else {
    disabledFindClient.value = false;
  }
});
</script>

<template>
  <v-row dense justify="center">
    <v-col id="tutorial-events-form-client" cols="12" md="3">
      <FindClient
        v-model="client"
        :disabled="disabledFindClient"
        :error-messages="errors.client_id"
      />
    </v-col>

    <v-col id="tutorial-events-form-client-name" cols="12" md="3">
      <UiTextField
        :model-value="(client as Client)?.name || ''"
        label="Nome completo"
        prepend-inner-icon="mdi-account"
        :disabled="true"
      />
    </v-col>

    <v-col id="tutorial-events-form-client-phone" cols="12" md="2">
      <UiTextField
        :model-value="(client as Client)?.phone || ''"
        label="Telefone"
        :disabled="true"
        prepend-inner-icon="mdi-phone"
      />
    </v-col>

    <v-col id="tutorial-events-form-client-phone-optional" cols="12" md="2">
      <UiTextField
        :model-value="(client as Client)?.phone_optional || ''"
        label="Telefone opcional"
        :disabled="true"
        prepend-inner-icon="mdi-phone"
      />
    </v-col>

    <v-col id="tutorial-events-form-status" cols="12" md="2">
      <Status v-model="status" :error-messages="errors.status" />
    </v-col>

    <v-col id="tutorial-events-form-location" cols="12" md="4">
      <UiTextField
        v-model="location"
        label="Endereço completo"
        prepend-inner-icon="mdi-map-marker"
        :error-messages="errors.location"
      />
    </v-col>

    <v-col cols="12" md="4">
      <div
        :class="
          mdAndUp ? 'd-flex align-center ga-2' : 'd-flex flex-column ga-2'
        "
      >
        <UiTextField
          id="tutorial-events-form-start-time"
          v-model="startTime"
          v-maska="'##/##/#### ##:##'"
          label="Inicio do evento"
          placeholder="__/__/____ __:__"
          :error-messages="errors.start_time"
        />

        <UiTextField
          id="tutorial-events-form-end-time"
          v-model="endTime"
          v-maska="'##/##/#### ##:##'"
          label="Final do evento"
          placeholder="__/__/____ __:__"
          :error-messages="errors.end_time"
        />

        <div class="d-flex flex-column align-center">
          <span class="text-caption mr-1">Duração:</span>
          <span class="text-caption font-weight-bold text-primary">
            {{ eventDurationHours.toFixed(2) }}
          </span>
        </div>
      </div>
    </v-col>

    <v-col id="tutorial-events-form-guests" cols="12" md="2">
      <UiTextField
        v-model="guestCount"
        label="Número de Convidados"
        prepend-inner-icon="mdi-account-group"
        :error-messages="errors.guest_count"
      />
    </v-col>

    <v-col id="tutorial-events-form-audience" cols="12" md="2">
      <AudienceProfile
        v-model="audienceProfile"
        :error-messages="errors.audience_profile"
      />
    </v-col>

    <v-col id="tutorial-events-form-notes" cols="12">
      <UiTextField
        v-model="notes"
        label="Observação"
        prepend-inner-icon="mdi-comment"
      />
    </v-col>
  </v-row>
</template>
