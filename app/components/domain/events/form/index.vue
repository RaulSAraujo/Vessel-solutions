<script setup lang="ts">
import { eventSchema } from "~/schemas/event";
import type { Datum } from "~/types/events";
import type { Datum as Drink } from "~/types/drinks";
import type { Datum as Client } from "~/types/clients";
import type { TableDrinks } from "~/types/event-drinks";

// components
import Table from "./Table.vue";
import Status from "./Status.vue";
import FindDrink from "./FindDrink.vue";
import FindClient from "./FindClient.vue";

type SelectedDrink = Drink & { drink_categories: { name: string } };

const props = defineProps<{
  event?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const client = ref<string | Client | null>(null);
const selectedDrink = ref<string | SelectedDrink | null>(null);
const drinks = ref<TableDrinks[]>([]);

const disabledFindDrink = computed(() => {
  return (
    !startTime.value ||
    !endTime.value ||
    !guestCount.value ||
    !audienceProfile.value
  );
});

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
  emit("submit", {
    ...values,
    event_drinks: drinks.value.map((e) => ({
      drink_id: e.drink_id,
      actual_quantity: e.actual_quantity,
      estimated_quantity: e.estimated_quantity,
    })),
  });
});

watch(client, (value) => {
  if (value && typeof value === "object") {
    clientId.value = value.id;
  } else {
    clientId.value = null;
  }
});

watch(selectedDrink, async () => {
  if (selectedDrink.value && typeof selectedDrink.value == "object") {
    const start = formatDateTimeToDB(startTime.value);
    const end = formatDateTimeToDB(endTime.value);

    const estimatedQuantity = await useCalculateDrinks(
      audienceProfile.value,
      new Date(start),
      new Date(end),
      guestCount.value
    );

    drinks.value.push({
      drink_id: selectedDrink.value.id,
      name: selectedDrink.value.name,
      category: selectedDrink.value.drink_categories.name,
      description: selectedDrink.value.description,
      image_url: selectedDrink.value.image_url,
      calculated_cost: selectedDrink.value.calculated_cost || 0,
      selling_price: selectedDrink.value.selling_price || 0,
      profit_margin_percentage:
        selectedDrink.value.profit_margin_percentage || 0,
      actual_quantity: 0,
      estimated_quantity: estimatedQuantity || 1,
    });

    selectedDrink.value = null;
  }
});

onMounted(() => {
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

      <v-col cols="12" md="3">
        <UiTextField
          v-model="location"
          label="Endereço completo"
          prepend-inner-icon="mdi-map-marker"
          :error-messages="errors.location"
        />
      </v-col>

      <v-col cols="12" md="1">
        <UiTextField
          v-model="distance"
          label="Km"
          prepend-inner-icon="mdi-road-variant"
          :error-messages="errors.distance"
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
          :items="['Casual', 'Premium', 'Corporativo']"
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

    <FindDrink
      v-model="selectedDrink"
      :disabled="disabledFindDrink"
      class="mt-5"
    />

    <Table
      class="my-5"
      :drinks="drinks"
      @delete="drinks.splice(drinks.indexOf($event), 1)"
    />

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
