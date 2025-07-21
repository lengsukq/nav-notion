import { createApp } from 'vue';
import pinia from './store';
import './style.css'
import App from './App.vue'

createApp(App).use(pinia).mount('#app')
