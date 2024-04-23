<template>
  <div class="friend-card d-flex gap-1" v-if="friendInfo">
    <div class="icon my-auto me-2">
      <img :src="friendInfo.image" alt="" />
    </div>
    <div class="text-content my-auto">
      <div class="name">
        {{ friendInfo.username }}
      </div>
      <div class="text" v-If="getLastUnread(chat.notifications)?.text">
        {{ getLastUnread(chat.notifications)?.text }}
      </div>
    </div>
    <div class="notification-container">
      <div class="date" v-if="getLastUnread(chat.notifications)?.date">
        {{ getLastUnread(chat.notifications).date }}
      </div>
      <div
        class="this-user-notifications"
        v-if="countUnread(chat.notifications) > 0"
      >
        {{ countUnread(chat.notifications) }}
      </div>
    </div>
    <span
      :class="{
        'contact-online': isFriendOnline(chat.friendInfo._id),
      }"
    ></span>
  </div>
</template>
<script setup>
import {
  ref,
  toRefs,
  reactive,
  watchEffect,
  watch,
  onMounted,
  computed,
} from "vue";
import { useUserStore } from "../../stores/user.js";
import { io } from "socket.io-client";
import moment from "moment/moment";

const props = defineProps({
  chat: Object,
});
const userStore = useUserStore();
const socket = userStore.socket;
const onlineUsersList = reactive([]);
const notifications = reactive([]);
const clickedChat = reactive({});
const latestUnreadNotif = reactive({});

const { chat } = toRefs(props);

const friendInfo = computed(() => {
  return chat.value.friendInfo ? chat.value.friendInfo : null;
});

const isFriendOnline = (friendId) => {
  if (onlineUsersList) {
    const isOnline = onlineUsersList.some((onlineUser) => {
      return onlineUser.user.userId === friendId;
    });
    return isOnline;
  }
  return false;
};

const unreadNotifications = (notifications) => {
  return notifications.filter((value) => value.isRead === false);
};

// count chat unread notifications
const countUnread = (data) => {
  let length = 0;
  data.forEach((item) => {
    if (!item.isRead) {
      length++;
    }
  });
  return length;
};

// update last unread notification
const getLastUnread = (data) => {
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].isRead) {
        return {
          text: data[i].text,
          date: formatTimestamp(data[i].date),
        };
      }
    }
  }
};

const formatTimestamp = (timestamp) => {
  return moment(timestamp).format("HH:mm");
};

watchEffect(() => {
  // listen to getOnlineUsers event from socket
  if (socket != null) {
    socket.on("getOnlineUsers", (onlineUsers) => {
      onlineUsers.forEach((user) => {
        onlineUsersList.push({ user });
      });
    });
  }

  // Add notifications to each chat
  const updateChatNotifications = () => {
    const notificationsData = unreadNotifications(userStore.notifications);
    notifications.splice(0, notifications.length, ...notificationsData);
    chat.value.notifications = [];
    notifications.forEach((notification) => {
      if (chat.value._id === notification.chatId) {
        chat.value.notifications.push(notification);
      }
    });
  };

  updateChatNotifications();

  //remove notifications for open chat
  if (
    userStore.chatList &&
    userStore.chatList[userStore.openedChatIndex] &&
    userStore.chatList[userStore.openedChatIndex]._id === chat.value._id
  ) {
    chat.value.notifications.forEach((value) => {
      value.isRead = true;
    });
  }

  // update latest unread notification
  // const latestUnread = getLastUnread(chat.notifications);
  // latestUnreadNotif.text = latestUnread ? latestUnread.text : null;
  // latestUnreadNotif.date = latestUnread ? latestUnread.date : null;
});
</script>
<style>
.friend-card {
  width: 100%;
}
</style>
