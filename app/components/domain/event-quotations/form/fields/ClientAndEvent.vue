<script lang="ts" setup>
import type { EventQuotation } from "~/types/event-quotations";

// components
import Status from "./Status.vue";

const props = defineProps<{
  eventQuotation?: EventQuotation | null;
  errors: Partial<Record<string, string | undefined>>;
}>();

const dayjs = useDayjs();
const store = useEventQuotationsStore();
const { eventDurationHours } = storeToRefs(store);

const { value: location } = useField<string>("location");
const { value: startTime } = useField<string>("start_time");
const { value: endTime } = useField<string>("end_time");
const { value: guestCount } = useField<number>("guest_count");
const { value: audienceProfile } = useField<string>("audience_profile");
const { value: status } = useField<string | null>("status", "draft");
const { value: notes } = useField<string | null>("notes");
const { value: clientName } = useField<string>("client_name");
const { value: clientEmail } = useField<string | null>("client_email");
const { value: clientPhone } = useField<string>("client_phone");

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
  if (props.eventQuotation) {
    location.value = props.eventQuotation.location;
    startTime.value = formatDate(
      props.eventQuotation.start_time,
      "DD/MM/YYYY HH:mm"
    );
    endTime.value = formatDate(
      props.eventQuotation.end_time,
      "DD/MM/YYYY HH:mm"
    );
    guestCount.value = props.eventQuotation.guest_count;
    audienceProfile.value = props.eventQuotation.audience_profile;
    status.value = props.eventQuotation.status;
    notes.value = props.eventQuotation.notes;
    clientName.value = props.eventQuotation.client_name;
    clientEmail.value = props.eventQuotation.client_email;
    clientPhone.value = props.eventQuotation.client_phone;

    // Calcular duração do evento
    store.calculateEventDuration(
      formatDate(props.eventQuotation.start_time, "DD/MM/YYYY HH:mm"),
      formatDate(props.eventQuotation.end_time, "DD/MM/YYYY HH:mm")
    );
  }
});
</script>

<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="3">
        <UiTextField
          v-model="clientName"
          label="Nome do Cliente"
          prepend-inner-icon="mdi-account"
          :error-messages="errors.client_name"
        />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          v-model="clientEmail"
          label="Email do Cliente"
          prepend-inner-icon="mdi-email"
          :error-messages="errors.client_email"
        />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          v-model="clientPhone"
          v-maska="'(##) #####-####'"
          label="Telefone do Cliente"
          prepend-inner-icon="mdi-phone"
          placeholder="(__) _____-____"
          :error-messages="errors.client_phone"
        />
      </v-col>

      <v-col cols="12" md="3">
        <Status v-model="status" :error-messages="errors.status" />
      </v-col>
    </v-row>

    <v-row dense justify="center">
      <v-col cols="12" md="4">
        <UiTextField
          v-model="location"
          label="Endereço completo"
          prepend-inner-icon="mdi-map-marker"
          :error-messages="errors.location"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-row dense>
          <v-col>
            <UiTextField
              v-model="startTime"
              v-maska="'##/##/#### ##:##'"
              label="Inicio do evento"
              placeholder="__/__/____ __:__"
              :error-messages="errors.start_time"
            />
          </v-col>

          <v-col>
            <UiTextField
              v-model="endTime"
              v-maska="'##/##/#### ##:##'"
              label="Final do evento"
              placeholder="__/__/____ __:__"
              :error-messages="errors.end_time"
            />
          </v-col>

          <v-col cols="1">
            <div class="d-flex flex-column align-center">
              <span class="text-caption mr-1">Duração:</span>
              <span class="text-caption font-weight-bold text-primary">
                {{ eventDurationHours.toFixed(2) }}
              </span>
            </div>
          </v-col>
        </v-row>
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
          :items="['Casual', 'Corporativo', 'Premium']"
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
    </v-row>
  </div>
</template>
