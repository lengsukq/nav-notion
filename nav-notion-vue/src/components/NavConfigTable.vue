<template>
  <div class="nav-config-table">
    <!-- 文件上传区域 -->
    <div class="file-upload-area mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-300 hover:shadow-md">
      <label 
        for="navConfigUpload" 
        class="upload-button button button-primary px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        选择 NavConfig 文件 (.json)
      </label>
      <input
        type="file"
        id="navConfigUpload"
        accept=".json"
        @change="handleFileUpload"
        class="hidden" 
      />
      <span v-if="currentFileName" class="file-name ml-4 px-3 py-1 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 transition-all duration-300">
        已选择: {{ currentFileName }}
      </span>
    </div>

    <!-- 表格显示区域 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>url</th>
            <th>description</th>
            <th>tag</th>
            <th>icon</th>
          </tr>
        </thead>
        <tbody>
          <!-- 空状态提示 -->
          <tr v-if="navItems.length === 0">
            <td colspan="5" class="empty-state">
              {{ currentFileName ? '该文件不包含有效的导航数据' : '请上传 NavConfig 文件以显示数据' }}
            </td>
          </tr>
          
          <!-- 数据列表 -->
          <tr v-for="item in navItems" :key="item.id">
            <td :title="item.name">{{ item.name }}</td>
            <td :title="item.url">{{ item.url }}</td>
            <td :title="item.description">{{ item.description }}</td>
            <td>
              <span class="tag-badge">{{ item.tag }}</span>
            </td>
            <td>
              <!-- 容错处理：直接显示文本或后续扩展为图片 -->
              <span class="truncate block max-w-[100px]" :title="item.icon">{{ item.icon }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';

// Type definitions
interface NavItem {
  id: string;
  name: string;
  url: string;
  description: string;
  tag: string;
  icon: string;
}

interface NavGroup {
  name: string;
  children?: NavItem[];
}

interface NavConfig {
  navConfig: NavGroup[];
}

interface ConfigItem {
  id?: string;
  name: string;
  type: string;
  url?: string;
  src?: string;
  config?: {
    title?: string;
  };
}

// Memory: 仅保留用于渲染的最终扁平化数据，不存储原始的大型 JSON 对象
const navItems = ref<NavItem[]>([]);
const currentFileName = ref<string>('');

/**
 * Logic: 纯函数，将嵌套的 Config 结构转换为扁平的表格数据
 * 使用 flatMap 替代嵌套的 forEach，减少代码复杂度 (Complexity)
 */
const transformConfigData = (json: any): NavItem[] => {
  if (!json?.navConfig || !Array.isArray(json.navConfig)) {
    throw new Error('JSON 格式错误：缺少 navConfig 数组');
  }

  return json.navConfig.flatMap((group: any) => {
    if (!group.children || !group.children.length) return [];
    
    // SRP: 过滤逻辑内聚
    return group.children
      .filter((item: any) => ['text', 'icon'].includes(item.type))
      .map((item: any): NavItem => ({
        id: item.id || crypto.randomUUID(), // 确保有唯一 key
        name: item.name,
        url: item.url || '-',
        description: item.config?.title || '-',
        tag: group.name, // 使用父级 group name 作为 tag
        icon: item.src || '-'
      }));
  });
};

/**
 * Async Helper: 将 FileReader 封装为 Promise，避免回调地狱
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// 主处理流程
const handleFileUpload = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return; // 用户取消选择

  // Reset state
  currentFileName.value = file.name;
  navItems.value = [];

  try {
    const fileContent = await readFileAsText(file);
    const parsedJson = JSON.parse(fileContent);
    
    // 执行数据转换
    const formattedData = transformConfigData(parsedJson);

    if (formattedData.length > 0) {
      navItems.value = formattedData;
      toast.success('解析成功', { description: `已加载 ${formattedData.length} 条导航数据。` });
    } else {
      toast.warning('数据为空', { description: '文件中没有符合条件的导航项。' });
    }
  } catch (error) {
    console.error('File processing error:', error);
    currentFileName.value = ''; // 如果失败，清除文件名以允许重新上传同名文件
    
    // 区分 JSON 解析错误和其他错误
    const errorMsg = error instanceof SyntaxError 
      ? '文件不是有效的 JSON 格式' 
      : (error instanceof Error ? error.message : '读取文件失败');
      
    toast.error('解析失败', { description: errorMsg });
  } finally {
    // 清空 input value，确保即使再次选择同一个文件也能触发 change 事件
    target.value = '';
  }
};
</script>

<style scoped>
.nav-config-table {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.file-upload-area {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.hidden {
  display: none;
}

.file-name {
  font-style: italic;
  color: #4a5568;
  font-size: 0.9rem;
}

/* 容器负责滚动，而不是让表格变样 */
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px; /* 保证最小宽度，触发滚动 */
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* 防止单列过宽 */
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background-color: #f8fafc;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-style: italic;
}

.tag-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e0f2fe;
  color: #0369a1;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-config-table {
    padding: 0 10px;
  }
  
  .file-upload-area {
    flex-direction: column;
    align-items: stretch;
  }
  
  .file-name {
    margin-left: 0;
    text-align: center;
  }
}
</style>