<template>
    <q-page padding class="bg-black">
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="email" type="email" :value="email" stack-label autofocus label="EMAIL">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="password" type="password" :value="id" stack-label autofocus label="PASSWORD">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                    <q-btn class="q-pl-lg q-pr-lg bg-red-10" @click="getUserId" style="width: 200px" size=md>LOG IN</q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                {{ errorText }}
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
            <div class="col text-center">
                    <q-btn v-if="showChoices" class="q-pl-lg q-pr-lg bg-teal-10" @click="monitor" style="width: 200px" size=md>MONITOR</q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                 <q-btn v-if="showChoices" class="q-pl-lg q-pr-lg bg-teal-10" @click="instructor" style="width: 200px" size=md>INSTRUCTOR</q-btn>
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
            email: '',
            password: '',
            id: '',
            errorText: '',
            connected: false,
            showChoices: false
        }
    },
    methods: {
        getUserId () {
            axios.post('http://localhost:8080/api/auth', {
                email: this.email,
                password: this.password
            }).then(res => {
                this.errorText = ''
                this.id = res.data
                this.showChoices = true
            }).catch(error => {
                this.errorText = error.response.data
                this.id =''
                this.showChoices = false
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
