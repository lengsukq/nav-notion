import { defineStore } from 'pinia';

// 定义设置状态管理Store
export const useSettingsStore = defineStore('settings', {
  state: () => {
  // 从localStorage加载保存的设置
  const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
  return {
    cardSizeMode: savedSettings.cardSizeMode || 'small', // 卡片大小模式，默认小卡
    isSettingsOpen: false // 控制设置模态框显示状态
  }},
  actions: {
    // 更新卡片大小模式
    setCardSizeMode(mode) {
      this.cardSizeMode = mode;
    },
    // 切换设置模态框显示状态
    toggleSettings() {
      console.log('toggleSettings called, current state:', this.isSettingsOpen);
      this.isSettingsOpen = !this.isSettingsOpen;
      console.log('toggleSettings updated state:', this.isSettingsOpen);
    },
    // 关闭设置模态框
    closeSettings() {
      this.isSettingsOpen = false;
      localStorage.setItem('appSettings', JSON.stringify({
          cardSizeMode: this.cardSizeMode
        }));
    }
  },
  created() {

  },
  getters: {
    // 获取当前卡片大小模式
    getCardSizeMode() {
      return this.cardSizeMode;
    },
    // 获取设置模态框显示状态
    getIsSettingsOpen() {
      return this.isSettingsOpen;
    }
  }
});