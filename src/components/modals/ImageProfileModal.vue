<template>
  <div
    class="modal fade"
    id="ImageProfileModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="ImageProfileModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ImageProfileModalLabel">
            Select an Image
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 1rem">
          <div class="image-management-container">
            <div class="selection-image-container">
              <input
                type="file"
                ref="fileInput"
                style="display: none"
                @change="handleFileUpload"
              />
              <div class="upload-image" @click="triggerFileInputClick">
                <i class="bi bi-upload"></i>
              </div>
              <div class="upload-text" @click="triggerFileInputClick">
                Upload Image
              </div>
            </div>
            <div class="selection-image-container">
              <div
                class="upload-image bg-light"
                data-bs-toggle="modal"
                data-bs-target="#AvatarListModal"
              >
                <i class="bi bi-upload text-dark"></i>
              </div>
              <div
                class="upload-text"
                data-bs-toggle="modal"
                data-bs-target="#AvatarListModal"
              >
                Choose Avatar
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="saveImage">
            Save Image
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Second Modal -->

  <div
    class="modal avatar-list fade"
    id="AvatarListModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="AvatarListModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="AvatarListModalLabel">
            Select an Image
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 1rem">
          <div class="grid-container">
            <div
              v-for="(image, index) in avatarList"
              :key="index"
              class="avatar-image"
              :class="{ 'avatar-image-active': selectedAvatar == index }"
              @click="selectedAvatar = index"
            >
              <AdvancedImage :cldImg="image.file" loading="lazy" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="saveImage">
            Save Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import toastr from "toastr";
import { Buffer } from "buffer";
import { reactive, ref, onMounted } from "vue";
import { AdvancedImage } from "@cloudinary/vue";
import { Cloudinary } from "@cloudinary/url-gen";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const avatarList = reactive([]);
const fileInput = ref(null);
const selectedAvatar = ref(null);

onMounted(() => {
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dxupeynms",
    },
  });
  userStore.fetchAvatarImages().then((res) => {
    // avatarList.splice(0, avatarList.length, ...res);

    const data = res.map((image) => {
      image.file = cld
        .image(image.cloudinary_id)
        .format("auto")
        .quality("auto");
      return image;
    });
    avatarList.splice(0, avatarList.length, ...data);
  });
});

const triggerFileInputClick = () => {
  fileInput.value.click();
};

const handleFileUpload = () => {
  const file = fileInput.value.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    base64Image.value = e.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

const saveImage = async () => {
  let user = userStore.user;

  user.image = avatarList[selectedAvatar.value]._id;
  userStore.updateUser(user).then(() => {
    toastr.success("User profile image updated successfully!", {
      positionClass: "toast-bottom-left",
    });
  });
};
</script>
<style>
.image-management-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.selection-image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 45%;
  height: 200px;
  background-color: #282a30;
  border-radius: 6px;
}
.upload-image {
  display: flex;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: #1b67d3;
  cursor: pointer;
}
.upload-image i {
  margin: auto;
  font-size: 2rem;
}
.upload-text {
  font-weight: 600;
  color: HSL(200, 4%, 55%);
  cursor: pointer;
}
.upload-text:hover {
  color: #f0f0f0;
}
/* avatar list */
.avatar-list .modal-dialog {
  max-width: 625px;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 10px;
}
.avatar-image {
  cursor: pointer;
}

/* .avatar-image:hover {
  border: 2px solid #f0f0f0;
} */
.avatar-image-active {
  border: 2px solid #f0f0f0;
}
</style>
