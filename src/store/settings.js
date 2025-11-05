import { defineStore } from 'pinia';

// 定义设置状态管理Store
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    cardSizeMode: localStorage.getItem('cardSizeMode') || 'large',
    isSettingsOpen: false,
    themeColor: localStorage.getItem('themeColor') || '#3B82F6',
    secondaryColor: localStorage.getItem('secondaryColor') || '#d1d1d1',
    tagFilterMode: localStorage.getItem('tagFilterMode') || 'single',
    // 缓存设置
    cacheExpiryTime: parseInt(localStorage.getItem('cacheExpiryTime')) || 24 // 默认24小时过期，0表示不缓存
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
      // 设置RGB格式变量
      const rgb = this.hexToRgb(color);
      document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      this.saveSettings();
    },
    setSecondaryColor(color) {
      this.secondaryColor = color;
      document.documentElement.style.setProperty('--secondary-color', color);
      // 计算并设置浅色和深色变体
      const lightColor = this.lightenColor(color, 0.2);
      const darkColor = this.darkenColor(color, 0.2);
      document.documentElement.style.setProperty('--secondary-color-light', lightColor);
      document.documentElement.style.setProperty('--secondary-color-dark', darkColor);
      // 设置RGB格式变量
      const rgb = this.hexToRgb(color);
      document.documentElement.style.setProperty('--secondary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      this.saveSettings();
    },
    setTagFilterMode(mode) {
      this.tagFilterMode = mode;
      this.saveSettings();
    },
    // 缓存相关方法
    setCacheExpiryTime(hours) {
      this.cacheExpiryTime = hours;
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
      localStorage.setItem('secondaryColor', this.secondaryColor);
      localStorage.setItem('tagFilterMode', this.tagFilterMode);
      // 保存缓存设置
      localStorage.setItem('cacheExpiryTime', this.cacheExpiryTime.toString());
    },
    resetSettings() {
      // 恢复默认设置
      this.cardSizeMode = 'large';
      this.themeColor = '#3B82F6';
      this.secondaryColor = '#d1d1d1';
      this.tagFilterMode = 'single';
      // 重置缓存设置为默认值
      this.cacheExpiryTime = 24;
      // 更新CSS变量
      document.documentElement.style.setProperty('--primary-color', this.themeColor);
      const primaryLightColor = this.lightenColor(this.themeColor, 0.2);
      const primaryDarkColor = this.darkenColor(this.themeColor, 0.2);
      document.documentElement.style.setProperty('--primary-color-light', primaryLightColor);
      document.documentElement.style.setProperty('--primary-color-dark', primaryDarkColor);
      const primaryRgb = this.hexToRgb(this.themeColor);
      document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      
      document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
      const secondaryLightColor = this.lightenColor(this.secondaryColor, 0.2);
      const secondaryDarkColor = this.darkenColor(this.secondaryColor, 0.2);
      document.documentElement.style.setProperty('--secondary-color-light', secondaryLightColor);
      document.documentElement.style.setProperty('--secondary-color-dark', secondaryDarkColor);
      const secondaryRgb = this.hexToRgb(this.secondaryColor);
      document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
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
    hexToRgb(hex) {
      // 将十六进制颜色转换为RGB格式
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
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