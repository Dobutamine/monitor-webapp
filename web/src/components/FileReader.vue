<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>

  <div v-if="isEnabled" class="row q-ml-md q-mr-md">
        <q-input type="text" label="new model name" v-model='json_filename' class="col q-mr-sm" dense color="teal-7" ></q-input>
  </div>
  <div v-if="isEnabled" class="row q-ma-md">
      <q-btn dense color="teal-7" style="width: 100%" @click="setJSON">save model to disk</q-btn>
  </div>

  <div v-if="isEnabled" class="row q-ma-md">
    <q-file
      v-model="file"
      dense
      label="load base model from disk"
      filled
      @input="loadTextFromFile"
    >
      <q-icon name="save" class="text-grey" style="font-size: 1rem;" />
    </q-file>
  </div>
</q-card>
</template>

<script>
export default {
  data () {
    return {
      file: null,
      json: null,
      json_filename: '',
      json_requested: false,
      snapshot_file: null,
      snapshot_file_name: 'snapshot',
      isEnabled: true,
      snapshotEnabled: false,
      snapshot: null
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (this.isEnabled | this.snapshotEnabled) {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'state':
                if (this.snapshot_requested) {
                  this.snapshot = message.data.data
                  this.downloadSnapshot()
                  this.snapshot_requested = false
                }
                break
              case 'json':
                if (this.json_requested) {
                  this.json = message.data.data
                  this.downloadJSON()
                  this.json_requested = false
                }
                break
            }
            break
        }
      }
    })
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    forceUpdate (e) {
      this.$forceUpdate()
      delete this.modelEventListener
      // restart the event listener
      this.buildEventListener()
    },
    buildEventListener () {

    },
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      this.snapshot_requested = false
    },
    toggleSnapshotEnabled () {
      this.snapshotEnabled = !this.snapshotEnabled
      this.snapshot_requested = false
    },
    getSnapshot () {
      const reader = new FileReader()
      reader.onload = (e) => {
        const storedSnapshot = JSON.parse(e.target.result)
        this.$model.setModelState(storedSnapshot)
        this.$model.getProperties(null)
      }
      reader.readAsText(this.snapshot_file)
      this.snapshot_file_name = this.snapshot_file.name
    },
    setJSON () {
      this.json_requested = true
      this.$model.getModelJSON()
    },
    setSnapshot () {
      this.snapshot_requested = true
      this.$model.getModelState()
    },
    downloadJSON () {
      this.json.name = this.json_filename
      const data = JSON.stringify(this.json)
      const blob = new Blob([data], { type: 'text/json' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      if (this.json_filename.includes('.json')) {
        a.download = this.json_filename
      } else {
        a.download = this.json_filename + '.json'
      }
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    downloadSnapshot () {
      const data = JSON.stringify(this.snapshot)
      const blob = new Blob([data], { type: 'text/json' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      if (this.snapshot_file_name.includes('.json')) {
        a.download = this.snapshot_file_name
      } else {
        a.download = this.snapshot_file_name + '.json'
      }

      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    loadTextFromFile () {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.$model.loadNewModelDefinition(JSON.parse(e.target.result))
        this.$root.$emit('forceupdate')
        this.$model.getProperties(null)
      }
      reader.readAsText(this.file)
    }
  }
}
</script>
