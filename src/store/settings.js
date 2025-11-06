import { defineStore } from 'pinia';
import { debounce, clamp } from 'lodash';

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
      // 使用 lodash 的 clamp 简化颜色变浅逻辑
      const r = clamp(parseInt(color.substring(1,3), 16) * (1 + percent), 0, 255);
      const g = clamp(parseInt(color.substring(3,5), 16) * (1 + percent), 0, 255);
      const b = clamp(parseInt(color.substring(5,7), 16) * (1 + percent), 0, 255);

      // 使用 padStart 确保两位数
      const toHex = (value) => Math.round(value).toString(16).padStart(2, '0');
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
    // 将十六进制颜色转换为RGB对象
    hexToRgb(hex) {
      // 使用 lodash 的 clamp 确保值在有效范围内
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: clamp(parseInt(result[1], 16), 0, 255),
        g: clamp(parseInt(result[2], 16), 0, 255),
        b: clamp(parseInt(result[3], 16), 0, 255)
      } : null;
    },
    darkenColor(color, percent) {
      // 使用 lodash 的 clamp 简化颜色变深逻辑
      const r = clamp(parseInt(color.substring(1,3), 16) * (1 - percent), 0, 255);
      const g = clamp(parseInt(color.substring(3,5), 16) * (1 - percent), 0, 255);
      const b = clamp(parseInt(color.substring(5,7), 16) * (1 - percent), 0, 255);

      // 使用 padStart 确保两位数
      const toHex = (value) => Math.round(value).toString(16).padStart(2, '0');
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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