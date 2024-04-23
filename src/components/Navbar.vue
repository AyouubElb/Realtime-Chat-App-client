<template lang="">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid container">
      <router-link class="nav-link text-light mt-2" to="/">
        <h4>ChattApp</h4>
      </router-link>
      <span class="text-warning">Logged in as UserName</span>
      <div class="navbar-collapse ml-auto">
        <ul class="navbar-nav mb-2 mx-4">
          <li class="nav-item mx-2">
            <span
              class="nav-link text-light"
              style="cursor: pointer"
              @click="testApi"
              >Test Button
            </span>
          </li>
          <li class="nav-item mx-2" v-if="!isAuthenticated">
            <span
              class="nav-link text-light"
              style="cursor: pointer"
              @click="handleLogin"
              >Login
            </span>
          </li>
          <li class="nav-item mx-2" v-if="!isAuthenticated">
            <span class="nav-link text-light" style="cursor: pointer"
              >Signup
            </span>
          </li>
          <li class="nav-item mx-2" v-if="isAuthenticated">
            <span
              class="nav-link text-light"
              style="cursor: pointer"
              @click="handleLogout"
              >Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref } from "vue";
import { API_URL } from "../config";
import toastr from "toastr";
import axios from "axios";
</script>

<style>
.navbar {
  width: 100%;
}
.navbar-collapse {
  /* make it take only the width of its content(important for ml-auto) */
  flex-grow: 0 !important;
}
</style>
