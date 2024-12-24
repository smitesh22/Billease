<script setup lang="ts">
  import {ref} from "vue";

  const firstNumber = ref(10);
  const secondNumber = ref(20);
  let result = ref(0);
  const handleClick = () => {
    result.value = Number(firstNumber.value) + Number(secondNumber.value);
  }
</script>

<template>
  <div>
    <input type="text" v-model="firstNumber" /> <br>
    <input type="text" v-model="secondNumber" /> <br>
    <button @click="handleClick">Add</button>

    <div>
      <h1 class="bg-red-300 text-5xl" v-if="result"> {{result}}</h1>
    </div>
  </div>
</template>

<style scoped>

</style>