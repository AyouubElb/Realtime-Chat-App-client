<template lang="">
  <div class="chat-section">
    <div
      class="message-box pt-4"
      v-if="windowWidth > 480 || userStore.openedChatIndex == -1"
    >
      <ChatHub />
    </div>
    <div
      class="chat-box"
      v-if="windowWidth > 480 || userStore.openedChatIndex >= 0"
    >
      <chatBox :clickedChat="clickedChat" />
    </div>
  </div>
</template>
<script setup>
import ChatHub from "../components/chat/ChatHub";
import chatBox from "../components/chat/chatBox";
import { onMounted, watchEffect, reactive, ref } from "vue";
import { useUserStore } from "../stores/user";
import { io } from "socket.io-client";
const userStore = useUserStore();
const socket = userStore.socket;
const user = reactive({});
const windowWidth = ref();

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  if (socket != null) {
    socket.emit("addNewUser", userStore.user._id);
  }
});
</script>

<style>
.chat-section {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.message-box {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  height: 100vh;
  background-color: #3a4042;
}

/* Chat Box */
.chat-box {
  background: #222831;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
@media screen and (max-device-width: 480px) {
  .message-box {
    width: 100%;
  }
}
</style>
