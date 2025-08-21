import { createApp } from 'vue';
import pinia from './store';
import { useSettingsStore } from './store/settings'
import './style.css'
import App from './App.vue'
import router from './router/index'
import 'vue-sonner/style.css'
const app = createApp(App)
  .use(pinia)
  .use(router)

// 初始化主题色
const settingsStore = useSettingsStore()
settingsStore.setThemeColor(settingsStore.themeColor)
settingsStore.setSecondaryColor(settingsStore.secondaryColor)

app.mount('#app')
