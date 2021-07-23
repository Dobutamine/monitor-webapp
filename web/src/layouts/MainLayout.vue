<template>
  <div class="q-pa-es">
    <q-layout view="lHh lpr lFf" container v-bind:style="{ height: height + 'px'}" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-bar>
          <q-icon name="laptop_chromebook" />
          <div>Explain Project - Patient monitor emulator</div>
        </q-bar>
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>

export default {
  name: 'MainLayout',

  data () {
    return {
      leftDrawerOpen: false,
      height: 1300

    }
  },
  mounted () {
    this.height = this.$q.screen.height
  }
}
</script>
