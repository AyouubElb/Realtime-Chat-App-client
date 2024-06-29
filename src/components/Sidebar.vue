<template>
  <div class="sidebar">
    <div class="sidebar-icon">
      <AdvancedImage
        :cldImg="userStore.profileImage"
        :alt="userStore.user.username"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { AdvancedImage } from "@cloudinary/vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
</script>

<style>
.sidebar {
  height: 100vh;
  width: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  /* background-color: #1e1f22; */
  background-color: #1d1f25;
}

.sidebar-icon img {
  width: 3rem;
  border-radius: 8px;
}
@media screen and (max-device-width: 480px) {
  .sidebar {
    display: none;
  }
}
</style>
