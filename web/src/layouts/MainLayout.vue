<template>
  <div class="q-pa-es">
    <q-layout view="lHh lpr lFf" container v-bind:style="{ height: height + 'px'}" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-bar v-if="barVisibility" class="bg-blue-10">
            <div class="col text-left">
              <q-icon name="laptop_chromebook" />
            </div>
            <div class="col3 text-center">
              <div v-if="visible" class="col text-center">
                  EXPLAIN! patient monitor emulator
              </div>
            </div>
            <div class="col text-right text-size-sm">
                    <q-btn :class="btnHome" @click="gotoHome" style="width: 100px" dense size=sm>
                    {{ userName }}</q-btn>
            </div>
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
      barVisibility: true,
      visible: false,
      userName: 'not logged in',
      leftDrawerOpen: false,
      height: 1300,
      btnHome: 'q-ma-sm bg-red-9',
      btnHomeVisibility: false,
      btnMonitor: 'q-ma-sm bg-blue-9',
      btnMonitorVisibility: false,
      btnInstructor: 'q-ma-sm bg-blue-9',
      btnInstructorVisibility: false,
      btnImages: 'q-ma-sm bg-blue-9',
      btnImagesVisibility: false,
      blue: 'q-ma-sm bg-blue-9',
      red: 'q-ma-sm bg-red-9'


    }
  },
  methods: {
    onLogin () {
      console.log('logged in')
    },
    gotoHome () {
      this.$router.push("/")
      this.btnHomeVisibility = false
      this.btnMonitorVisibility = false
      this.btnInstructorVisibility = false
      this.btnImagesVisibility = false
    },
    gotoMonitor () {
      this.$router.push("/monitor")
      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
    },
    gotoInstructor () {
      this.$router.push("/instructor")
      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
    },
    gotoImages () {
      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
      this.$router.push("/media")
      
    },
  },
  mounted () {
    this.height = this.$q.screen.height
    this.$root.$on('login', (name) => { 
      this.userName = name
    })
    this.$root.$on('show', () => {
      this.visible = true
    })

    this.$root.$on('hide', () => {
      this.visible = false
    })

    this.$root.$on('home', () => {
      this.barVisibility = true
      this.btnHome = this.red
      this.btnMonitor = this.blue
      this.btnInstructor = this.blue
      this.btnImages = this.blue

      this.btnHomeVisibility = false
      this.btnMonitorVisibility = false
      this.btnInstructorVisibility = false
      this.btnImagesVisibility = false


    })
    this.$root.$on('monitor', () => {
      this.barVisibility = true
      this.btnHome = this.blue
      this.btnMonitor = this.red
      this.btnInstructor = this.blue
      this.btnImages = this.blue

      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
      
    })
    this.$root.$on('instructor', () => {
      this.barVisibility = true
      this.btnHome = this.blue
      this.btnMonitor = this.blue
      this.btnInstructor = this.red
      this.btnImages = this.blue

      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
      
    })
    this.$root.$on('images', () => {
      this.btnHome = this.blue
      this.btnMonitor = this.blue
      this.btnInstructor = this.blue
      this.btnImages = this.red

      this.btnHomeVisibility = true
      this.btnMonitorVisibility = true
      this.btnInstructorVisibility = true
      this.btnImagesVisibility = true
      
    })

    this.$root.$on('barvisible', (toggle) => {
      this.barVisibility = toggle
      
    })
  },
  beforeDestroy() {
    this.$root.$off('login')
    this.$root.$off('home')
    this.$root.$off('monitor')
    this.$root.$off('instructor')
    this.$root.$off('images')
    this.$root.$off('hide')
    this.$root.$off('show')
    this.$root.$off('barvisible')

  }
}
</script>
