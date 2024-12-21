<template>
  <div>
    <h1>{{ text }}</h1>
    <h3>Click count : {{counter}}</h3>
    <button @click="handleClick">Click Me</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HelloWorld',
  data(){
    return {
      text: "Click Me!",
      counter: 0,
    }
  },
  methods: {
    handleClick(){
      console.log("clicked");
      this.text = this.text === "You Clicked Me!" ? "Click Me!": "You Clicked Me!";
      this.counter = this.counter + 1;
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #358a65;
}
</style>
