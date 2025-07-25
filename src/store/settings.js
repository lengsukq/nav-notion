import { defineStore } from 'pinia';

// 定义设置状态管理Store
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    cardSizeMode: localStorage.getItem('cardSizeMode') || 'large',
    isSettingsOpen: false,
    themeColor: localStorage.getItem('themeColor') || '#3B82F6',
    tagFilterMode: localStorage.getItem('tagFilterMode') || 'single'
  }),
  actions: {
    setCardSizeMode(mode) {
      this.cardSizeMode = mode;
      this.saveSettings();
    },
    setThemeColor(color) {
      this.themeColor = color;
      document.documentElement.style.setProperty('--primary-color', color);
      // 计算并设置浅色和深色变体
      const lightColor = this.lightenColor(color, 0.2);
      const darkColor = this.darkenColor(color, 0.2);
      document.documentElement.style.setProperty('--primary-color-light', lightColor);
      document.documentElement.style.setProperty('--primary-color-dark', darkColor);
      this.saveSettings();
    },
    setTagFilterMode(mode) {
      this.tagFilterMode = mode;
      this.saveSettings();
    },
    toggleSettings() {
      console.log('toggleSettings called, current state:', this.isSettingsOpen);
      this.isSettingsOpen = !this.isSettingsOpen;
      console.log('toggleSettings updated state:', this.isSettingsOpen);
    },
    closeSettings() {
      this.isSettingsOpen = false;
    },
    setSettingsOpen(value) {
      this.isSettingsOpen = value;
    },
    saveSettings() {
      localStorage.setItem('cardSizeMode', this.cardSizeMode);
      localStorage.setItem('themeColor', this.themeColor);
      localStorage.setItem('tagFilterMode', this.tagFilterMode);
    },
    resetSettings() {
      // 恢复默认设置
      this.cardSizeMode = 'large';
      this.themeColor = '#3B82F6';
      this.tagFilterMode = 'single';
      // 更新CSS变量
      document.documentElement.style.setProperty('--primary-color', this.themeColor);
      const lightColor = this.lightenColor(this.themeColor, 0.2);
      const darkColor = this.darkenColor(this.themeColor, 0.2);
      document.documentElement.style.setProperty('--primary-color-light', lightColor);
      document.documentElement.style.setProperty('--primary-color-dark', darkColor);
      // 保存默认设置
      this.saveSettings();
    },
    lightenColor(color, percent) {
      // 实现颜色变浅逻辑
      let R = parseInt(color.substring(1,3),16);
      let G = parseInt(color.substring(3,5),16);
      let B = parseInt(color.substring(5,7),16);

      R = Math.min(255, Math.round(R * (1 + percent)));
      G = Math.min(255, Math.round(G * (1 + percent)));
      B = Math.min(255, Math.round(B * (1 + percent)));

      const RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
      const GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
      const BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

      return '#' + RR + GG + BB;
    },
    darkenColor(color, percent) {
      // 实现颜色变深逻辑
      let R = parseInt(color.substring(1,3),16);
      let G = parseInt(color.substring(3,5),16);
      let B = parseInt(color.substring(5,7),16);

      R = Math.max(0, Math.round(R * (1 - percent)));
      G = Math.max(0, Math.round(G * (1 - percent)));
      B = Math.max(0, Math.round(B * (1 - percent)));

      const RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
      const GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
      const BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

      return '#' + RR + GG + BB;
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