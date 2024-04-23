<template>
  <div class="message-box-header">
    <p>Chats</p>
  </div>
  <div class="contact-search">
    <input
      type="text"
      placeholder="Find or start a conversation"
      @click="getUsers"
      data-bs-toggle="modal"
      data-bs-target="#friendsModal"
    />
    <div
      class="modal fade"
      id="friendsModal"
      tabindex="-1"
      aria-labelledby="friendsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content friends-modal-content">
          <div class="modal-header flex-column align-items-start gap-3">
            <h2 class="modal-title fs-5">Select Friend</h2>
            <input type="text" placeholder="Find or start a conversation" />
          </div>
          <div class="modal-body">
            <ul class="users-container m-0 p-0">
              <li v-for="(user, index) in userList" :key="index">
                <div
                  class="user-item"
                  :class="{ 'active-user-item': selectedUserIndex === index }"
                  v-if="user._id !== userStore.user._id"
                  @click="selectedUserIndex = index"
                >
                  <img :src="user.image" :alt="user.username" />
                  <div class="user-name my-auto">
                    {{ user.username }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary open-chat-button"
              @click="newChat"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="add-friend">
    <p>Personal Messages</p>
    <i class="bi bi-plus-square"></i>
  </div>
  <div v-for="(chat, index) in chatList" :key="index">
    <div
      class="contact-card"
      :class="{
        'active-contact-card': index === clickedChatIndex,
      }"
      @click="openChat(index)"
    >
      <UserChat :chat="chat" />
    </div>
    <!-- <div class="contact-card" @click="openChat(chat)">
      <UserChat :chat="chat" />
    </div> -->
  </div>
  <div class="user-panel">
    <div class="icon me-2">
      <img :src="userStore.profileImage" :alt="userStore.profileImage" />
    </div>
    <div class="user_name">{{ userStore.user.username }}</div>
    <router-link to="/profile-settings" class="setting-btn">
      <i class="bi bi-gear-fill"></i>
    </router-link>
  </div>
</template>
<script setup>
import UserChat from "./UserChat.vue";
import { API_URL } from "../../config";
import { ref, reactive, onMounted, computed, toRaw } from "vue";
import { useUserStore } from "@/stores/user.js";
import { io } from "socket.io-client";
const userStore = useUserStore();
const socket = userStore.socket;

const chatList = reactive([]);
const userList = reactive([]);
const selectedUserIndex = ref(null);
const openedChatIndex = ref();

const openChat = (index) => {
  openedChatIndex.value = index;
  userStore.openedChatIndex = openedChatIndex.value;
};

onMounted(() => {
  // fetch user chats
  userStore.fetchAllChats().then((chats) => {
    // Fetch Friend info for each chat
    const fetchFriendInfoPromises = chats.map((chat) => {
      // Convert Proxy(Array) to regular array
      // chat.notifications = JSON.parse(JSON.stringify(chat.notifications));

      const friendId = chat.members.find((id) => id !== userStore.user._id);

      return userStore.fetchUserById(friendId).then((res) => {
        chat.friendInfo = res;
        chat.friendInfo.image = `http://localhost:8000/Images/${chat.friendInfo.image}`;
        chat.user = userStore.user;
      });
    });

    Promise.all(fetchFriendInfoPromises).then(() => {
      chatList.splice(0, chatList.length, ...chats);
      userStore.chatList = chatList;
    });
  });

  userStore.sendNewUser();
});

// Fetch all users
const getUsers = () => {
  userStore.fetchAllUsers().then((res) => {
    const data = res.map((user) => {
      user.image = `http://localhost:8000/Images/${user.image}`;
      return user;
    });
    userList.splice(0, userList.length, ...data);
  });
};

const newChat = () => {
  const result = chatList.find(
    (chat) => chat.friendInfo._id === userList[selectedUserIndex.value]._id
  );
  if (!result) {
    const newFriendId = userList[selectedUserIndex.value]._id;
    userStore.createChat(newFriendId).then((res) => {
      chatList.push(res);
    });
  }
};
</script>
<style>
.message-box-header {
  padding-inline: 1rem;
}
.message-box-header p {
  font-size: 1.5rem;
  color: #d3d3d3;
}
.contact-search {
  padding-inline: 1rem;
  margin-bottom: 2rem;
}
.contact-search input {
  width: 100%;
  background-color: #1d1f25;
  border: #d3d3d3 1px solid;
  border-radius: 4px;
  color: #d3d3d3;
  padding: 0.25rem 1rem;
}
.contact-search .modal-body {
  padding: 10px 8px;
}
.modal .friends-modal-content {
  width: 80% !important;
}
.modal .users-container .user-item {
  display: flex;
  gap: 10px;
  padding: 6px 8px;
  cursor: pointer;
}
.modal .users-container .user-item:hover {
  background-color: #4d5355;
}
.modal .users-container .active-user-item {
  background-color: #4d5355;
}
.modal .users-container .user-item img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}
.modal .users-container .user-item .user-name {
  font-size: 14px;
  font-weight: 500;
}
.modal .open-chat-button {
  border: #1b67d3 1px solid;
  background-color: #1b67d3;
  width: 100%;
}
.modal .open-chat-button:hover {
  background-color: #1560bd;
}
.add-friend {
  display: flex;
  color: #d3d3d3;
  padding-inline: 1rem;
}
.add-friend p {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
.add-friend i {
  margin-left: auto;
  cursor: pointer;
}
/* User Card */
.contact-card {
  border-bottom: 1px solid rgb(100, 100, 100);
  width: 100%;
  height: 4rem;
  display: flex;
  margin-inline: auto;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.contact-card:hover {
  background-color: #4d5355;
}

.active-contact-card {
  background-color: #4d5355;
}

.icon img {
  width: 2.5rem;
  border-radius: 50%;
}

.contact-card .text-content {
  width: min(70%, 170px);
}

.contact-card .notification-container {
  margin-left: auto;
}

.contact-card .name {
  font-weight: 700;
}

.contact-card .text,
.contact-card .date {
  font-size: 14px;
  color: rgb(180, 180, 180);
}

.contact-card .date {
  margin-bottom: 0.5rem;
}

.contact-online {
  display: inline-block;
  height: 12px;
  min-width: 12px;
  border-radius: 50%;
  background: rgb(0, 219, 0);
  z-index: 2;
}

.this-user-notifications {
  display: flex;
  background: #0092ca;
  height: 20px;
  width: 20px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.user-panel {
  display: flex;
  background-color: #1d1f25;
  margin-top: auto;
  padding: 0.5rem 1rem;
}
.user-panel .user_name {
  margin-top: auto;
  margin-bottom: auto;
}
.setting-btn {
  color: #d3d3d3;
  margin: auto 0 auto auto;
  padding: 6px;
  cursor: pointer;
}
.setting-btn:hover {
  background-color: #2d2f35;
}
</style>
