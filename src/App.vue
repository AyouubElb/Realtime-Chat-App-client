<template>
  <main>
    <Sidebar v-if="isChatPage" />
    <router-view />
  </main>
</template>
<script setup>
import Sidebar from "./components/Sidebar.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const isChatPage = ref(false);

onMounted(() => {
  const route = useRoute();
  if (route.path === "/") {
    isChatPage.value = true;
  }
});
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
  font: inherit;
}

img,
svg {
  display: block;
  max-width: 100%;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none !important;
}
button {
  border-radius: 4px;
}
/* Modal */

.modal-content {
  color: white !important;
  background-color: #3a4042 !important;
  border-radius: 6px !important;
}
.modal-title {
  font-weight: 600 !important;
  font-size: 1.5rem !important;
}
</style>
