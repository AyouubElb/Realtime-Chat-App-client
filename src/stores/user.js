import { defineStore } from "pinia";
import axios from "axios";
import { io } from "socket.io-client";
import { Buffer } from "buffer";
import toastr from "toastr";
import { Cloudinary } from "@cloudinary/url-gen";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      API_URL: "https://realtime-chat-app-server-tau.vercel.app/api",
      jwt: localStorage.getItem("jwt_info")
        ? JSON.parse(localStorage.getItem("jwt_info"))
        : null,
      profileImage: null,
      chatList: [],
      openedChatIndex: -1,
      notifications: [],
      cld: new Cloudinary({
        cloud: {
          cloudName: "dxupeynms",
        },
      }),
    };
  },
  getters: {
    isAuthenticated() {
      return this.jwt ? true : false;
    },
    user() {
      return this.jwt ? this.jwt.user : null;
    },
    profileImage() {
      if (this.user && this.user.image) {
        return this.cld
          .image(this.user.image.cloudinary_id)
          .format("auto")
          .quality("auto");
      } else return {};
    },
    friendId() {
      const id = this.clickedChat.members.find((id) => id !== this.user._id);
      return id;
    },
    socket() {
      return io("https://realtime-chat-app-socket.onrender.com");
    },
  },
  actions: {
    async fetchAllUsers() {
      try {
        const res = await axios.get(`${this.API_URL}/users`);
        return res.data;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async fetchUserById(id) {
      try {
        const res = await axios.get(`${this.API_URL}/users/find/${id}`);
        return res.data.user;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async updateUser(user) {
      try {
        const res = await axios.patch(
          `${this.API_URL}/users/update/${this.user._id}`,
          user
        );

        this.jwt.user = res.data.user;
        localStorage.setItem("jwt_info", JSON.stringify(this.jwt));
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    sendNewUser() {
      if (this.$socket != null) {
        this.$socket.emit("addNewUser", this.$user._id);
      }
    },
    async fetchAllChats() {
      try {
        const res = await axios.get(`${this.API_URL}/chats/${this.user._id}`);
        // this.chats = res.data.chats;
        console.log("chats Test", res.data);
        return res.data;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async createChat(id) {
      try {
        const res = await axios.post(`${this.API_URL}/chats`, {
          firstId: this.user._id,
          secondId: id,
        });
        return res.data;
      } catch (error) {
        console.log(error);
        toastr.error(err, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async fetchChatMessages(chatId) {
      try {
        const res = await axios.get(`${this.API_URL}/messages/${chatId}`);
        return res.data.messages;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async sendMessage(messageInfo) {
      try {
        const res = await axios.post(
          `${this.API_URL}/messages/${messageInfo.senderId}`,
          messageInfo
        );
        console.log("new message ", res);
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async fetchUserImage() {
      try {
        const res = await axios.get(
          `${this.API_URL}/images/${this.user.image}`
        );
        this.profileImage = Buffer.from(res.data.data, "binary").toString(
          "base64"
        );
        this.profileImageUrl = `data:image/jpg;base64,${this.profileImage}`;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async fetchAvatarImages() {
      try {
        const res = await axios.get(`${this.API_URL}/images`);
        return res.data;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
    async createNotification(data) {
      try {
        const res = await axios.post(
          `${this.API_URL}/notifications/create`,
          data
        );
        console.log("new notification", res.data);
        // return res.data;
      } catch (error) {
        console.log(error);
        toastr.error(error, "Server Error!", {
          positionClass: "toast-bottom-left",
        });
      }
    },
  },
});
