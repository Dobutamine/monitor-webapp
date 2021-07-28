<template>
    <q-page padding class="bg-black">
        <div v-if="newUserEntry" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="name" :value="name" stack-label autofocus label="IMAGE">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>

        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col2 text-center">
                    <q-uploader
                        url="http://localhost:8080/api/media/upload"
                        label="media upload"
                        style="max-width: 300px"
                    />
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                 
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
            name: '',
            email: '',
            password: '',
            id: '',

        }
    },
    methods: {
        uploadNewMedia () {
            axios.post('http://localhost:8080/api/users', {
                name: this.name,
                email: this.email,
                password: this.password
            }).then(res => {
                this.errorText = 'Thank you for registering. Have fun!'
                this.id = res.data
                this.login = true
                this.newUserText = 'NEW USER'
                this.newUserEntry = false
            }).catch(error => {
                this.errorText = error.response.data
                this.id =''
                this.showChoices = false
                this.login = true
                this.newUserEntry = true
            })
        }
    },
    mounted () {
        this.$q.dark.set(true)
    }
}
</script>

<style>

</style>
