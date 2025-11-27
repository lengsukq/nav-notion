import { defineStore } from 'pinia';
import { debounce, clamp } from 'lodash';
import navigationCache from '../utils/cache';

// 类型定义
export type CardSizeMode = 'small' | 'medium' | 'large';
export type TagFilterMode = 'single' | 'multiple';

interface ThemeColorRGB {
  r: number;
  g: number;
  b: number;
}

// 定义设置状态管理Store
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    cardSizeMode: (localStorage.getItem('cardSizeMode') as CardSizeMode) || 'large',
    isSettingsOpen: false,
    themeColor: localStorage.getItem('themeColor') || '#3B82F6',
    secondaryColor: localStorage.getItem('secondaryColor') || '#d1d1d1',
    tagFilterMode: (localStorage.getItem('tagFilterMode') as TagFilterMode) || 'single',
    // 缓存设置
    cacheExpiryTime: parseInt(localStorage.getItem('cacheExpiryTime') || '24') || 24 // 默认24小时过期，0表示不缓存
  }),
  actions: {
    setCardSizeMode(mode: CardSizeMode) {
      this.cardSizeMode = mode;
      this.saveSettings();
    },
    setThemeColor(color: string) {
      this.themeColor = color;
      document.documentElement.style.setProperty('--primary-color', color);
      // 计算并设置浅色和深色变体
      const lightColor = this.lightenColor(color, 0.2);
      const darkColor = this.darkenColor(color, 0.2);
      document.documentElement.style.setProperty('--primary-color-light', lightColor);
      document.documentElement.style.setProperty('--primary-color-dark', darkColor);
      // 设置RGB格式变量
      const rgb = this.hexToRgb(color);
      if (rgb) {
        document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
      this.saveSettings();
    },
    setSecondaryColor(color: string) {
      this.secondaryColor = color;
      document.documentElement.style.setProperty('--secondary-color', color);
      // 计算并设置浅色和深色变体
      const lightColor = this.lightenColor(color, 0.2);
      const darkColor = this.darkenColor(color, 0.2);
      document.documentElement.style.setProperty('--secondary-color-light', lightColor);
      document.documentElement.style.setProperty('--secondary-color-dark', darkColor);
      // 设置RGB格式变量
      const rgb = this.hexToRgb(color);
      if (rgb) {
        document.documentElement.style.setProperty('--secondary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
      this.saveSettings();
    },
    setTagFilterMode(mode: TagFilterMode) {
      this.tagFilterMode = mode;
      this.saveSettings();
    },
    // 缓存相关方法
    setCacheExpiryTime(hours: number) {
      this.cacheExpiryTime = hours;
      this.saveSettings();
      
      // 如果设置为不缓存（0小时），立即清除所有已缓存的数据
      if (hours === 0) {
        navigationCache.clearAllCache();
      }
    },
    toggleSettings(): void {
      console.log('toggleSettings called, current state:', this.isSettingsOpen);
      this.isSettingsOpen = !this.isSettingsOpen;
      console.log('toggleSettings updated state:', this.isSettingsOpen);
    },
    closeSettings(): void {
      this.isSettingsOpen = false;
    },
    setSettingsOpen(value: boolean): void {
      this.isSettingsOpen = value;
    },
    saveSettings(): void {
      localStorage.setItem('cardSizeMode', this.cardSizeMode);
      localStorage.setItem('themeColor', this.themeColor);
      localStorage.setItem('secondaryColor', this.secondaryColor);
      localStorage.setItem('tagFilterMode', this.tagFilterMode);
      // 保存缓存设置
      localStorage.setItem('cacheExpiryTime', this.cacheExpiryTime.toString());
    },
    resetSettings(): void {
      // 恢复默认设置
      this.cardSizeMode = 'large';
      this.themeColor = '#3B82F6';
      this.secondaryColor = '#d1d1d1';
      this.tagFilterMode = 'single';
      
      // 更新缓存设置时不通过 setCacheExpiryTime 方法，避免意外清除缓存
      const previousCacheExpiryTime = this.cacheExpiryTime;
      this.cacheExpiryTime = 24;
      
      // 更新CSS变量
      document.documentElement.style.setProperty('--primary-color', this.themeColor);
      const primaryLightColor = this.lightenColor(this.themeColor, 0.2);
      const primaryDarkColor = this.darkenColor(this.themeColor, 0.2);
      document.documentElement.style.setProperty('--primary-color-light', primaryLightColor);
      document.documentElement.style.setProperty('--primary-color-dark', primaryDarkColor);
      const primaryRgb = this.hexToRgb(this.themeColor);
      if (primaryRgb) {
        document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      }
      
      document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
      const secondaryLightColor = this.lightenColor(this.secondaryColor, 0.2);
      const secondaryDarkColor = this.darkenColor(this.secondaryColor, 0.2);
      document.documentElement.style.setProperty('--secondary-color-light', secondaryLightColor);
      document.documentElement.style.setProperty('--secondary-color-dark', secondaryDarkColor);
      const secondaryRgb = this.hexToRgb(this.secondaryColor);
      if (secondaryRgb) {
        document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
      }
      // 保存默认设置
      this.saveSettings();
    },
    lightenColor(color: string, percent: number): string {
      // 使用 lodash 的 clamp 简化颜色变浅逻辑
      const r = clamp(parseInt(color.substring(1,3), 16) * (1 + percent), 0, 255);
      const g = clamp(parseInt(color.substring(3,5), 16) * (1 + percent), 0, 255);
      const b = clamp(parseInt(color.substring(5,7), 16) * (1 + percent), 0, 255);

      // 使用 padStart 确保两位数
      const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
    // 将十六进制颜色转换为RGB对象
    hexToRgb(hex: string): ThemeColorRGB | null {
      // 使用 lodash 的 clamp 确保值在有效范围内
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result || !result[1] || !result[2] || !result[3]) {
        return null;
      }
      return {
        r: clamp(parseInt(result[1], 16), 0, 255),
        g: clamp(parseInt(result[2], 16), 0, 255),
        b: clamp(parseInt(result[3], 16), 0, 255)
      };
    },
    darkenColor(color: string, percent: number): string {
      // 使用 lodash 的 clamp 简化颜色变深逻辑
      const r = clamp(parseInt(color.substring(1,3), 16) * (1 - percent), 0, 255);
      const g = clamp(parseInt(color.substring(3,5), 16) * (1 - percent), 0, 255);
      const b = clamp(parseInt(color.substring(5,7), 16) * (1 - percent), 0, 255);

      // 使用 padStart 确保两位数
      const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  },
  getters: {
    // 获取当前卡片大小模式
    getCardSizeMode(): CardSizeMode {
      return this.cardSizeMode;
    },
    // 获取设置模态框显示状态
    getIsSettingsOpen(): boolean {
      return this.isSettingsOpen;
    }
  }
});