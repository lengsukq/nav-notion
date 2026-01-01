declare const navigationCache: {
  getCache(tags: string[], tagFilterMode: string, customExpiryTime?: number): any;
  setCache(tags: string[], tagFilterMode: string, data: any, metadata?: any): void;
  removeCache(tags: string[], tagFilterMode: string): void;
  getMetadataCache(customExpiryTime?: number): any;
  setMetadataCache(metadata: any): void;
  removeMetadataCache(): void;
  clearAllCache(): void;
  clearExpiredCache(customExpiryTime?: number): void;
  getCacheStats(): any;
};

export default navigationCache;