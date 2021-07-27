<template>
    <q-page padding class="bg-black">
        <div v-if="newUserEntry" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="name" :value="name" stack-label autofocus label="NAME">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div v-if="login" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="email" type="email" :value="email" stack-label autofocus label="EMAIL">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div v-if="login" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-form @submit="getUserId">
                    <q-input v-model="password" type="password" :value="id" stack-label autofocus label="PASSWORD">
                    </q-input>
                </q-form>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div v-if="login" class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                    <q-btn v-if="!newUserEntry" class="q-pl-lg q-pr-lg bg-teal-10" @click="getUserId" style="width: 150px" size=sm>LOG IN</q-btn>
                    <q-btn class="q-ml-lg q-pl-lg q-pr-lg bg-teal-10" @click="newUser" style="width: 150px" size=sm>{{ newUserText }}</q-btn>
            </div>
            <div class="col text-center">
                
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-card v-if='errorText != ""' class='q-pa-sm'>
                    {{ errorText }}
                </q-card>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div v-if="showChoices" class="col text-center">
                SELECT YOUR APPLICATION
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col2 text-center">
                    <q-btn v-if="showChoices" class="q-pl-lg q-pr-lg bg-teal-10" @click="monitor" style="width: 150px" size=sm>MONITOR</q-btn>
                    <q-btn v-if="showChoices" class="q-ml-lg q-pl-lg q-pr-lg bg-teal-10" @click="instructor" style="width: 150px" size=sm>INSTRUCTOR</q-btn>
                    <q-btn v-if="showChoices" class="q-ml-lg q-pl-lg q-pr-lg bg-teal-10" @click="instructor" style="width: 150px" size=sm>MEDIA</q-btn>
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
            errorText: '',
            connected: false,
            showChoices: false,
            newUserEntry: false,
            newUserText: 'NEW USER',
            login: true
        }
    },
    methods: {
        newUser () {
            if (!this.newUserEntry) {
                this.newUserEntry = true
                this.newUserText = 'REGISTER'
            } else {
                this.registerNewUser()
            }
        },
        registerNewUser () {
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
        },
        getUserId () {
            axios.post('http://localhost:8080/api/auth', {
                email: this.email,
                password: this.password
            }).then(res => {
                this.name = res.data.name
                this.errorText = `Welcome ${this.name}`
                this.id = res.data.id
                this.showChoices = true
                this.login = false
            }).catch(error => {
                this.errorText = error.response.data
                this.id =''
                this.showChoices = false
                this.login = true
            })
        },
        monitor () {
            this.$store.commit('dataPool/id', this.id)
            this.$router.push("/monitor")
        },
        instructor () {
            this.$store.commit('dataPool/id', this.id)
            this.$router.push("/instructor")
        }
    },
    mounted () {
        this.$q.dark.set(true)
    }
}
</script>

<style>

</style>
