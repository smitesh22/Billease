import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia'
import {GOOGLE_AUTH_CLIENT_ID} from "./secrets/secrets";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia);
app.use(router)
app.mount('#app')
