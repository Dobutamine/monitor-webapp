<template>
  <q-page padding class="bg-black">
    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-input
          v-model="name"
          :value="name"
          stack-label
          autofocus
          label="USER NAME"
        >
        </q-input>
      </div>
      <div class="col text-center"></div>
    </div>
    <div v-if="newUserEntry" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-input
          v-model="email"
          type="email"
          :value="email"
          stack-label
          autofocus
          label="EMAIL"
        >
        </q-input>
      </div>
      <div class="col text-center"></div>
    </div>
    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-form @submit="pressedEnter">
          <q-input
            v-model="password"
            type="password"
            :value="id"
            stack-label
            label="PASSWORD"
          >
          </q-input>
        </q-form>
      </div>
      <div class="col text-center"></div>
    </div>
    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="!newUserEntry"
          class="q-pl-lg q-pr-lg bg-blue-10"
          @click="getUserId"
          style="width: 150px"
          size="sm"
          >LOG IN</q-btn
        >
        <q-btn
          class="q-ml-lg q-pl-lg q-pr-lg bg-blue-10"
          @click="newUser"
          style="width: 150px"
          size="sm"
          >REGISTER</q-btn
        >
        <q-btn
          v-if="newUserEntry"
          class="q-ml-lg q-pl-lg q-pr-lg bg-blue-10"
          @click="cancelRegistration"
          style="width: 150px"
          size="sm"
          >CANCEL</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-card v-if="errorText != ''" class="q-pa-sm">
          {{ errorText }}
        </q-card>
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div v-if="showChoices" class="col text-center">
        SELECT YOUR APPLICATION
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="showChoices"
          class="q-pl-lg q-pr-lg bg-blue-10"
          @click="monitor"
          style="width: 150px"
          size="sm"
          >MONITOR</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="showChoices"
          class="q-pl-lg q-pr-lg bg-blue-10"
          @click="instructor"
          style="width: 150px"
          size="sm"
          >INSTRUCTOR</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="showChoices"
          class="q-pl-lg q-pr-lg bg-blue-10"
          @click="media"
          style="width: 150px"
          size="sm"
          >IMAGES</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="showChoices"
          class="q-pl-lg q-pr-lg bg-red-10"
          @click="logout"
          style="width: 150px"
          size="sm"
          >LOG OUT</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
/* eslint-disable */
export default {
  data() {
    return {
      apiUrl: "",
      name: "",
      email: "",
      password: "",
      id: "",
      errorText: "",
      connected: false,
      showChoices: false,
      newUserEntry: false,
      login: true
    };
  },
  methods: {
    cancelRegistration() {
      this.id = "";
      this.newUserEntry = false;
      this.showChoices = false;
      this.login = true;
      this.email = "";
      this.password = "";
      this.name = "";
    },
    logout() {
      this.id = "";
      this.$store.commit("dataPool/id", this.id);
      this.showChoices = false;
      this.login = true;
      this.email = "";
      this.password = "";
      this.name = "";
      this.errorText = "";
      this.$root.$emit("home");
      this.$root.$emit("login", "not logged in");
      this.$root.$emit("hide");
    },
    pressedEnter() {
      if (this.newUserEntry) {
        this.registerNewUser();
      } else {
        this.getUserId();
      }
    },
    newUser() {
      if (!this.newUserEntry) {
        this.newUserEntry = true;
      } else {
        this.registerNewUser();
      }
    },
    registerNewUser() {
      const url = `${this.apiUrl}/api/users`;
      axios
        .post(url, {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(res => {
          this.errorText = "Thank you for registering. Have fun!";
          this.id = res.data;
          this.login = true;
          this.newUserEntry = false;
        })
        .catch(error => {
          this.errorText = error.response.data;
          this.id = "";
          this.showChoices = false;
          this.login = true;
          this.newUserEntry = true;
          this.email = "";
          this.password = "";
          this.name = "";
        });
    },
    getUserId() {
      const url = `${this.apiUrl}/api/auth`;
        axios
        .post(url, {
          name: this.name,
          password: this.password
        })
        .then(res => {
          this.name = res.data.name;
          this.id = res.data.id;
          this.$store.commit("dataPool/id", this.id);
          this.errorText = `Welcome ${this.name}`;
          this.$root.$emit("login", res.data.name);
          this.showChoices = true;
          this.login = false;
          this.$root.$emit("show");
        })
        .catch(error => {
          this.errorText = error.response.data;
          this.id = "";
          this.showChoices = false;
          this.login = true;
        });
    },
    monitor() {
      this.$store.commit("dataPool/id", this.id);
      this.$root.$emit("monitor");
      this.$router.push("/monitor");
    },
    instructor() {
      this.$store.commit("dataPool/id", this.id);
      this.$root.$emit("instructor");
      this.$router.push("/instructor");
    },
    media() {
      this.$store.commit("dataPool/id", this.id);
      this.$root.$emit("images");
      this.$router.push("/media");
    }
  },
  mounted() {
    this.$q.dark.set(true);
    this.apiUrl = this.$store.state.dataPool.apiUrl;
    this.id = "";
    this.$store.commit("dataPool/id", this.id);
    this.email = "";
    this.password = "";
    this.name = "";
    this.$root.$emit("home");
    this.$root.$emit("login", "not logged in");
    this.$root.$emit("hide");
  }
};
</script>

<style></style>
