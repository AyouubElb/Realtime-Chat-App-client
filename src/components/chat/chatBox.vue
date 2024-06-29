<template lang="">
  <div class="chat-header" v-if="chatInfo && chatInfo.friendInfo">
    <div class="header-left-arrow me-1" @click="userStore.openedChatIndex = -1">
      <i class="bi bi-arrow-left-short"></i>
    </div>
    <div class="chat-header-icon me-3">
      <!-- <img :src="chatInfo.friendInfo.image" alt="" /> -->
      <AdvancedImage
        :cldImg="chatInfo.friendInfo.image"
        :alt="chatInfo.friendInfo.username"
        loading="lazy"
      />
    </div>
    <strong>{{ chatInfo.friendInfo.username }}</strong>
  </div>
  <div
    class="messages"
    ref="messagesContainer"
    v-if="chatInfo && chatInfo.friendInfo"
  >
    <div v-for="(message, index) in messages" :key="index">
      <div
        class="message mb-2"
        :class="{
          'self ms-auto': message.senderId == userStore.user._id,
          '': message.senderId != userStore.user._id,
        }"
        v-if="message.chatId === chatInfo._id"
      >
        <p style="margin-bottom: 0.2rem">{{ message.text }}</p>
        <p style="margin-bottom: 0.2rem" class="message-date">
          {{ formatTimestamp(message.createdAt) }}
        </p>
      </div>
    </div>
  </div>
  <div class="chat-input d-flex gap-2" v-if="chatInfo && chatInfo.friendInfo">
    <input
      type="text"
      class="input px-3 py-2"
      placeholder="Type a message"
      v-model="newMessage"
      @keyup.enter="sendMessageHandler()"
    />
    <div class="send-arrow-btn my-auto" @click="sendMessageHandler()">
      <i class="bi bi-send-arrow-up-fill"></i>
    </div>
  </div>
</template>
<script setup>
import {
  onMounted,
  onBeforeUnmount,
  onUpdated,
  ref,
  reactive,
  watchEffect,
} from "vue";
import { AdvancedImage } from "@cloudinary/vue";
import { useUserStore } from "../../stores/user.js";
import { io } from "socket.io-client";
import moment from "moment/moment";

const userStore = useUserStore();
const chatInfo = ref();
const socket = userStore.socket;
const contact = reactive({});
const messages = reactive([]);
const messageInfo = reactive({});
const newMessage = ref();
const messagesContainer = ref(null);
const notifications = reactive([]);
// const setNotifications = reactive([]);

const formatTimestamp = (timestamp) => {
  // return moment(timestamp).format("YYYY-MM-DD HH:mm");
  return moment(timestamp).format("HH:mm");
};
// Scroll to the bottom of the messages container
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

onUpdated(() => {
  scrollToBottom();
});
/**************/

watchEffect(() => {
  chatInfo.value = userStore.chatList[userStore.openedChatIndex];

  // get chat messages
  if (chatInfo.value) {
    userStore.fetchChatMessages(chatInfo.value._id).then((res) => {
      messages.splice(0, messages.length, ...res); // Update messages with the fetched messages
    });
  }

  // if (userStore.clickedChat?.members) {
  //   const id = userStore.friendId;
  //   // console.log("ID", id);

  //   userStore.fetchUserById(id).then((res) => {
  //     contact.username = res.username;
  //   });
  //   userStore.fetchChatMessages(chatInfo.value._id).then((res) => {
  //     messages.splice(0, messages.length, ...res); // Update messages with the fetched messages
  //     console.log("fetchedMessages", messages);
  //   });
  // }
  const handleReceiveMessage = (data) => {
    messages.push(data);
  };

  const handleReceivedNotification = (data) => {
    const isChatOpen = data.chatId === chatInfo.value_id;

    if (isChatOpen) {
      data.isRead = true;
      notifications.splice(0, 0, data);
    } else {
      notifications.splice(0, 0, data);
    }
    userStore.notifications = notifications;
  };

  // Clean up existing event listeners
  socket.off("receiveMessage");
  socket.off("receiveNotification");

  // receive message and notification
  socket.on("receiveMessage", handleReceiveMessage);
  socket.on("receiveNotification", handleReceivedNotification);
});

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
  socket.off("receiveMessage");
  socket.off("receiveNotification");
});

const sendMessageHandler = () => {
  // Create a copy of the chatInfo object
  // const chatInfoCopy = { ...chatInfo.value };

  // // Remove friendInfo and user properties from the chatInfo copy
  // delete chatInfoCopy.friendInfo;
  // delete chatInfoCopy.user;
  // console.log("chatInfoCopy", chatInfoCopy.notifications[0]);

  let bodyInfo = {
    chatId: chatInfo.value._id,
    senderId: userStore.user._id,
    text: newMessage.value,
  };

  userStore.sendMessage(bodyInfo).then(() => {
    messages.push(bodyInfo);

    // const newNotif = {
    //   chatId: chatInfo.value._id,
    //   senderId: userStore.user._id,
    //   isRead: false,
    //   date: new Date(),
    //   text: newMessage.value,
    // };
    socket.emit("sendMessage", {
      chatId: chatInfo.value._id,
      senderId: userStore.user._id,
      isRead: false,
      date: new Date(),
      text: newMessage.value,
      receiverId: chatInfo.value.friendInfo._id,
    });

    // userStore.createNotification(newNotif);

    newMessage.value = "";
  });

  // socket.emit("sendMessage", {
  //   chatInfo: chatInfoCopy,
  //   senderId: userStore.user._id,
  //   receiverId: chatInfo.value.friendInfo._id,
  //   text: newMessage.value,
  // });
};
</script>
<style>
/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #313538;
}

.chat-header-icon img {
  width: 2rem;
  border-radius: 50%;
}
.header-left-arrow i {
  font-size: 2rem;
  cursor: pointer;
}
/* Messages */
.messages {
  max-height: 100vh;
  overflow-y: auto;
  margin-top: auto;
  padding: 0 2rem;
}

.message {
  display: flex;
  color: white;
  background: #282828;
  padding: 0.25rem;
  border-radius: 5px;
  max-width: 30%; /* Adjust the maximum width as needed */
}

.message.self {
  background: #0092ca;
}

.message-date {
  font-size: 12px;
  margin-left: auto;
  font-weight: 400;
}
.chat-input {
  width: 100%;
  /* background: rgb(30, 30, 30); */
  padding: 1rem 1.5rem;
}
.send-arrow-btn {
  background-color: #0092ca;
  border-radius: 50%;
  padding: 5px 9px;
  cursor: pointer;
}
.send-arrow-btn i {
  color: #fff;
  font-size: 1.125rem;
}
.input {
  width: 95%;
  border-radius: 8px;
}
/* .send-btn {
  border: none;
  background: rgba(72, 112, 223, 1);
  color: whitesmoke;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.button-icon {
  display: flex;
  justify-content: center;
} */
@media screen and (max-device-width: 480px) {
  .chat-header-icon img {
    width: 2.5rem;
  }
}
</style>
