/**
 * 首页数据缓存管理器
 * Refactored: 遵循 DRY 原则，移除 Lodash 依赖，优化内存占用
 */

class NavigationCache {
  constructor() {
    this.CACHE_PREFIX = 'nav_notion_cache_';
    this.DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
    this.VERSION = '1.0';
    this.METADATA_KEY_SUFFIX = '_metadata';
  }

  // ==========================================
  // Public API
  // ==========================================

  /**
   * 获取导航列表缓存
   * @param {Array} tags - 标签数组
   * @param {string} tagFilterMode - 标签过滤模式
   * @param {number} [customExpiryTime] - 自定义过期时间
   */
  getCache(tags, tagFilterMode, customExpiryTime = null) {
    const key = this._generateCacheKey(tags, tagFilterMode);
    return this._getInternal(key, customExpiryTime);
  }

  /**
   * 设置导航列表缓存
   */
  setCache(tags, tagFilterMode, data, metadata = {}) {
    const key = this._generateCacheKey(tags, tagFilterMode);
    this._setInternal(key, data, metadata);
  }

  /**
   * 删除特定缓存
   */
  removeCache(tags, tagFilterMode) {
    const key = this._generateCacheKey(tags, tagFilterMode);
    this._removeItem(key);
  }

  /**
   * 获取数据库元数据缓存 (复用底层逻辑)
   */
  getMetadataCache(customExpiryTime = null) {
    const key = this._generateMetadataKey();
    return this._getInternal(key, customExpiryTime);
  }

  /**
   * 设置数据库元数据缓存 (复用底层逻辑)
   */
  setMetadataCache(metadata) {
    const key = this._generateMetadataKey();
    this._setInternal(key, metadata);
  }

  /**
   * 删除元数据缓存
   */
  removeMetadataCache() {
    this._removeItem(this._generateMetadataKey());
  }

  /**
   * 清除所有本模块管理的缓存
   */
  clearAllCache() {
    this._getAllManagedKeys().forEach(key => localStorage.removeItem(key));
  }

  /**
   * 清除已过期的缓存
   * 优化: 使用 Guard Clauses 减少嵌套
   */
  clearExpiredCache(customExpiryTime = null) {
    const expiryTime = customExpiryTime || this.DEFAULT_EXPIRY;
    const now = Date.now();

    this._getAllManagedKeys().forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const { timestamp } = JSON.parse(raw);
        if (now - timestamp > expiryTime) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        // 数据损坏，直接清除
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * 获取缓存统计信息
   * Refactor: 移除 Lodash，使用原生方法
   */
  getCacheStats() {
    let totalSize = 0;
    let itemCount = 0;
    let oldest = Date.now();
    let newest = 0;

    const keys = this._getAllManagedKeys();

    keys.forEach(key => {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      // 计算大小
      totalSize += new Blob([raw]).size;
      itemCount++;

      try {
        // 仅提取时间戳，防止解析整个大对象
        // 简单的正则提取比 JSON.parse 整个对象在内存上更轻量 (针对极大对象时)
        const match = raw.match(/"timestamp":(\d+)/);
        const timestamp = match ? parseInt(match[1], 10) : 0;

        if (timestamp) {
          if (timestamp < oldest) oldest = timestamp;
          if (timestamp > newest) newest = timestamp;
        }
      } catch (e) { /* ignore */ }
    });

    // Inner helper: 格式化函数仅在此处使用，保持作用域封闭
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };

    return {
      itemCount,
      totalSize: formatBytes(totalSize),
      oldestCache: itemCount > 0 ? new Date(oldest).toLocaleString() : null,
      newestCache: itemCount > 0 ? new Date(newest).toLocaleString() : null
    };
  }

  // ==========================================
  // Private Methods (Core Logic)
  // ==========================================

  /**
   * 统一的底层获取逻辑 (DRY)
   * 处理过期检查、JSON解析和异常
   */
  _getInternal(key, customExpiryTime) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const expiry = customExpiryTime || this.DEFAULT_EXPIRY;

      if (Date.now() - parsed.timestamp > expiry) {
        this._removeItem(key);
        return null;
      }
      return parsed; // 返回完整结构 { timestamp, data, metadata }
    } catch (error) {
      console.warn(`[Cache] Parse error for ${key}, cleaning up.`);
      this._removeItem(key);
      return null;
    }
  }

  /**
   * 统一的底层设置逻辑 (DRY)
   * 处理配额超限重试策略
   */
  _setInternal(key, data, metadata = {}) {
    const payload = {
      timestamp: Date.now(),
      data,
      metadata // 即使为空也保持结构一致性
    };

    const trySet = () => {
      try {
        localStorage.setItem(key, JSON.stringify(payload));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          return false;
        }
        throw error; // 非配额错误直接抛出
      }
    };

    // 第一次尝试
    if (trySet()) return;

    // 失败则清理旧缓存
    console.warn('[Cache] Storage quota exceeded. Pruning old entries...');
    this._pruneOldEntries();

    // 重试
    if (!trySet()) {
      console.error('[Cache] Failed to write cache after pruning.');
    }
  }

  _removeItem(key) {
    localStorage.removeItem(key);
  }

  _generateCacheKey(tags, mode) {
    // 原生 sort 替代 lodash
    const sortedTags = Array.isArray(tags) ? [...tags].sort().join(',') : '';
    return `${this.CACHE_PREFIX}${this.VERSION}_${mode}_${sortedTags}`;
  }

  _generateMetadataKey() {
    return `${this.CACHE_PREFIX}${this.VERSION}${this.METADATA_KEY_SUFFIX}`;
  }

  _getAllManagedKeys() {
    return Object.keys(localStorage).filter(k => k.startsWith(this.CACHE_PREFIX));
  }

  /**
   * 清除最旧的缓存 (LRU Policy approximation)
   * 优化: 减少全量 JSON.parse
   */
  _pruneOldEntries() {
    const keys = this._getAllManagedKeys();
    if (keys.length === 0) return;

    const cacheItems = keys.map(key => {
      try {
        const raw = localStorage.getItem(key);
        // 尝试通过正则快速获取时间戳，避免 parse 大对象
        const match = raw && raw.match(/"timestamp":(\d+)/);
        return {
          key,
          timestamp: match ? parseInt(match[1], 10) : 0
        };
      } catch (e) {
        return { key, timestamp: 0 }; // 损坏的数据优先删除
      }
    });

    // 按时间戳排序 (旧 -> 新)
    cacheItems.sort((a, b) => a.timestamp - b.timestamp);

    // 删除最旧的 25%
    const deleteCount = Math.ceil(cacheItems.length * 0.25);
    cacheItems.slice(0, deleteCount).forEach(item => {
      localStorage.removeItem(item.key);
    });
  }
}

const navigationCache = new NavigationCache();
export default navigationCache;