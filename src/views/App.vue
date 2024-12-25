<template>
  <h1>Hello from library page</h1>
</template>

<script setup lang="ts">
import {useUserStore} from "../store/user.ts";
import {onMounted} from "vue";

const userStore = useUserStore();

onMounted(() => {
  console.log(userStore.getUser);
})
</script>