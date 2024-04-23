<template>
  <div class="sidebar">
    <div class="sidebar-icon">
      <img :src="userStore.profileImage" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  beforeRouteEnter(to, from, next) {
    console.log("before router enter");
  },
};
</script>
<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const profileImageUrl = computed(() => {
  return `http://localhost:8000/Images/${userStore.user.image}`;
});
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
