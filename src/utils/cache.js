/**
 * 首页数据缓存管理器
 * 用于缓存按分类获取的导航数据，减少API调用
 */
import { filter, sortBy, map, take, forEach } from 'lodash';

class NavigationCache {
  constructor() {
    this.cachePrefix = 'nav_notion_cache_';
    this.defaultExpiryTime = 24 * 60 * 60 * 1000; // 默认24小时（毫秒）
    this.cacheVersion = '1.0'; // 缓存版本，用于缓存格式升级时清除旧缓存
  }

  /**
   * 生成缓存键名
   * @param {Array} tags - 标签数组
   * @param {string} tagFilterMode - 标签过滤模式
   * @returns {string} 缓存键名
   */
  generateCacheKey(tags, tagFilterMode) {
    // 对标签进行排序，确保相同标签不同顺序的缓存键一致
    const sortedTags = [...tags].sort();
    const tagsString = sortedTags.join(',');
    return `${this.cachePrefix}${this.cacheVersion}_${tagFilterMode}_${tagsString}`;
  }

  /**
   * 获取缓存数据
   * @param {Array} tags - 标签数组
   * @param {string} tagFilterMode - 标签过滤模式
   * @param {number} customExpiryTime - 自定义过期时间（毫秒）
   * @returns {Object|null} 缓存的数据或null
   */
  getCache(tags, tagFilterMode, customExpiryTime = null) {
    const cacheKey = this.generateCacheKey(tags, tagFilterMode);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }

    try {
      const parsedData = JSON.parse(cachedData);
      const expiryTime = customExpiryTime || this.defaultExpiryTime;
      
      // 检查缓存是否过期
      if (Date.now() - parsedData.timestamp > expiryTime) {
        this.removeCache(tags, tagFilterMode);
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('解析缓存数据失败:', error);
      this.removeCache(tags, tagFilterMode);
      return null;
    }
  }

  /**
   * 设置缓存数据
   * @param {Array} tags - 标签数组
   * @param {string} tagFilterMode - 标签过滤模式
   * @param {Object} data - 要缓存的数据
   * @param {Object} metadata - 元数据（如nextCursor, hasMore等）
   */
  setCache(tags, tagFilterMode, data, metadata = {}) {
    const cacheKey = this.generateCacheKey(tags, tagFilterMode);
    const cacheData = {
      timestamp: Date.now(),
      data: data,
      metadata: metadata
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('设置缓存失败:', error);
      // 如果localStorage空间不足，尝试清除旧缓存
      if (error.name === 'QuotaExceededError') {
        this.clearOldCache();
        // 再次尝试设置缓存
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (retryError) {
          console.error('重试设置缓存失败:', retryError);
        }
      }
    }
  }

  /**
   * 删除特定缓存
   * @param {Array} tags - 标签数组
   * @param {string} tagFilterMode - 标签过滤模式
   */
  removeCache(tags, tagFilterMode) {
    const cacheKey = this.generateCacheKey(tags, tagFilterMode);
    localStorage.removeItem(cacheKey);
  }

  /**
   * 生成数据库元数据缓存键
   * @returns {string} 缓存键
   */
  generateMetadataCacheKey() {
    return `${this.cachePrefix}${this.cacheVersion}_metadata`;
  }

  /**
   * 获取数据库元数据缓存
   * @param {number} customExpiryTime - 自定义过期时间（毫秒）
   * @returns {Object|null} 缓存的元数据或null
   */
  getMetadataCache(customExpiryTime = null) {
    const cacheKey = this.generateMetadataCacheKey();
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }

    try {
      const parsedData = JSON.parse(cachedData);
      const expiryTime = customExpiryTime || this.defaultExpiryTime;
      
      // 检查缓存是否过期
      if (Date.now() - parsedData.timestamp > expiryTime) {
        this.removeMetadataCache();
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('解析元数据缓存失败:', error);
      this.removeMetadataCache();
      return null;
    }
  }

  /**
   * 设置数据库元数据缓存
   * @param {Object} metadata - 数据库元数据
   */
  setMetadataCache(metadata) {
    const cacheKey = this.generateMetadataCacheKey();
    const cacheData = {
      timestamp: Date.now(),
      data: metadata
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('设置元数据缓存失败:', error);
      // 如果localStorage空间不足，尝试清除旧缓存
      if (error.name === 'QuotaExceededError') {
        this.clearOldCache();
        // 再次尝试设置缓存
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (retryError) {
          console.error('重试设置元数据缓存失败:', retryError);
        }
      }
    }
  }

  /**
   * 删除数据库元数据缓存
   */
  removeMetadataCache() {
    const cacheKey = this.generateMetadataCacheKey();
    localStorage.removeItem(cacheKey);
  }

  /**
   * 清除所有导航缓存
   */
  clearAllCache() {
    const keys = Object.keys(localStorage);
    const cacheKeys = filter(keys, key => key.startsWith(this.cachePrefix));
    forEach(cacheKeys, key => localStorage.removeItem(key));
  }

  /**
   * 清除过期的缓存
   * @param {number} customExpiryTime - 自定义过期时间（毫秒）
   */
  clearExpiredCache(customExpiryTime = null) {
    const keys = Object.keys(localStorage);
    const expiryTime = customExpiryTime || this.defaultExpiryTime;
    const now = Date.now();
    
    const cacheKeys = filter(keys, key => key.startsWith(this.cachePrefix));
    forEach(cacheKeys, key => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key));
        if (now - cachedData.timestamp > expiryTime) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // 如果解析失败，直接删除该缓存
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * 清除最旧的缓存项（当存储空间不足时使用）
   */
  clearOldCache() {
    const keys = filter(Object.keys(localStorage), key => key.startsWith(this.cachePrefix));
    
    if (keys.length === 0) return;
    
    // 使用 lodash 的 map 和 sortBy 简化数组操作
    const cacheItems = sortBy(
      map(keys, key => {
        try {
          const cachedData = JSON.parse(localStorage.getItem(key));
          return {
            key,
            timestamp: cachedData.timestamp || 0
          };
        } catch (error) {
          return {
            key,
            timestamp: 0
          };
        }
      }),
      'timestamp'
    );
    
    // 删除最旧的25%缓存项
    const itemsToDelete = Math.ceil(cacheItems.length * 0.25);
    const itemsToRemove = take(cacheItems, itemsToDelete);
    forEach(itemsToRemove, item => localStorage.removeItem(item.key));
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计信息
   */
  getCacheStats() {
    const keys = filter(Object.keys(localStorage), key => key.startsWith(this.cachePrefix));
    let totalSize = 0;
    let itemCount = 0;
    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    
    forEach(keys, key => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key));
        const size = new Blob([localStorage.getItem(key)]).size;
        totalSize += size;
        itemCount++;
        
        if (cachedData.timestamp < oldestTimestamp) {
          oldestTimestamp = cachedData.timestamp;
        }
        if (cachedData.timestamp > newestTimestamp) {
          newestTimestamp = cachedData.timestamp;
        }
      } catch (error) {
        // 忽略解析失败的缓存项
      }
    });
    
    return {
      itemCount,
      totalSize: this.formatBytes(totalSize),
      oldestCache: oldestTimestamp === Date.now() ? null : new Date(oldestTimestamp).toLocaleString(),
      newestCache: newestTimestamp === 0 ? null : new Date(newestTimestamp).toLocaleString()
    };
  }

  /**
   * 格式化字节数为可读格式
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 创建单例实例
const navigationCache = new NavigationCache();

export default navigationCache;