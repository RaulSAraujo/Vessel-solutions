<script lang="ts" setup></script>

<template>
  <v-row
    class="action-section d-flex align-center justify-center text-center"
    :class="$vuetify.display.mobile ? 'py-8' : 'py-16'"
  >
    <v-col cols="12" md="8">
      <h2 class="mb-4" :class="$vuetify.display.mobile ? 'text-h4' : 'text-h3'">
        Pronto para Elevar sua Coquetelaria?
      </h2>

      <p
        class="mb-8"
        :class="$vuetify.display.mobile ? 'text-body-1' : 'text-h6'"
      >
        Junte-se a outros profissionais que já estão transformando a gestão de
        seus negócios com Vessel.
      </p>

      <v-btn
        rounded="lg"
        color="primary"
        :size="$vuetify.display.mobile ? 'large' : 'x-large'"
        variant="elevated"
        to="/auth/register"
        :block="$vuetify.display.mobile"
      >
        Crie sua Conta Grátis
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.action-section {
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-background)),
    rgb(var(--v-theme-primary))
  );
}
</style>
