<template>
    <q-page padding class="bg-black">
        <div v-if="id ==='' " class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-btn class="q-pl-lg q-pr-lg bg-red-10" @click="gotoLogin" style="width: 150px" size=sm>LOG IN</q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>

        <div v-if="id != ''" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-card  class='q-pa-sm'>
                    UPLOAD IMAGES
                </q-card>
            </div>
            <div class="col text-center">
            </div>
        </div>
        
          <div v-if="id != ''" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col4">
                    <q-uploader
                        style="max-width: 300px; margin-left: auto; margin-right: auto"
                        url="http://localhost:8080/api/media/upload"
                        label="max file size (500k)"
                        max-file-size=500000
                        dark
                        flat
                        color="blue-10"
                        accept=".jpg"
                        @finish="getMediaFilelistFromServer"
                        @rejected="onRejected"
                    />
            </div>
            <div class="col text-center">
            </div>
        </div>

        <div v-if="id != ''" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-card  class='q-pa-sm'>
                    AVAILABLE IMAGES
                </q-card>
            </div>
            <div class="col text-center">
            </div>
        </div>

        <div v-if="id != ''" class="row justify-center items-center q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col justify-center">
                <q-select v-model="selectedMediaFile" :options="mediaFilelist" style="max-width: 300px; margin-left: auto; margin-right: auto" @input="displayImage" @click="getMediaFilelistFromServer" stack-label label="select image" />
            
            </div>
            <div class="col text-center">
            </div>
        </div>

        <div v-if="id != ''" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-img
                    :src="imgUrl"
                    :style="imgSize">
                </q-img>
            </div>
            <div class="col text-center">
            </div>
        </div>       
        
    </q-page>
</template>

<script>

import axios from 'axios'
/* eslint-disable */
export default {
    data () {
        return {
            id: '',
            imgUrl: '',
            imgSize: `height: 200px; width: 200px`,
            selectedMediaFile: '',
            mediaFilelist: []
        }
    },
    methods: {
        gotoLogin() {
            this.$router.push("/")
        },
        onRejected () {
            console.log('rejected')
        },
        displayImage (selectedFile) {
            this.imgUrl = `http://localhost:8080/${selectedFile}`
            console.log(this.imgUrl)
        },
        getMediaFilelistFromServer () {
            axios.get('http://localhost:8080/api/media/list')
                .then( res => {
                    this.mediaFilelist = res.data.filter(file => file.endsWith('jpg'));
                })
        },
        uploadNewMedia () {
            axios.post('http://localhost:8080/api/users', {
                name: this.name,
                email: this.email,
                password: this.password
            }).then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
        }
    },
    mounted () {
        this.$root.$emit('images')
        this.$root.$emit('show')
        this.id = this.$store.state.dataPool.id
        this.$q.dark.set(true)
        this.getMediaFilelistFromServer()
    }
}
</script>

<style>

</style>
