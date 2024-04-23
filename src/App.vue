<template>
  <main>
    <Sidebar v-if="isChatPage" />
    <router-view />
  </main>
</template>
<script setup>
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
