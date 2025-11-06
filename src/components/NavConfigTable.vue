<template>
  <div class="nav-config-table">
    <!-- 文件上传区域 -->
    <div class="file-upload-area mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-300 hover:shadow-md">
      <label for="navConfigUpload" class="upload-button button button-primary px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
        选择 NavConfig 文件 (.json)
      </label>
      <input
        type="file"
        id="navConfigUpload"
        accept=".json"
        @change="handleFileUpload"
        style="display: none;"
      />
      <span v-if="fileName" class="file-name ml-4 px-3 py-1 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 transition-all duration-300">已选择: {{ fileName }}</span>
      <!-- 移除自定义的 message 提示 -->
    </div>

    <!-- 表格显示区域 -->
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
        <!-- 当 tableData 为空时，可以显示一个提示 -->
        <tr v-if="tableData.length === 0 && !fileName">
            <td colspan="5" style="text-align: center; font-style: italic;">请上传 NavConfig 文件以显示数据。</td>
        </tr>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.url || '-' }}</td>
          <td>{{ item.description || '-' }}</td>
          <td>{{ item.tag }}</td>
          <td>
            <!-- <img v-if="item.icon" :src="item.icon" class="icon" alt="icon" /> -->
            <!-- <span v-else>-</span> -->
            {{ item.icon }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Toaster 组件将在这里渲染（全局注册后，你不需要在组件内再次声明） -->
    <!-- <Toaster /> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { forEach, filter } from 'lodash';
// Import toast from vue-sonner
import { toast } from 'vue-sonner'; // <-- 导入 toast 函数

// 导航配置数据，初始为空
const navConfig = ref([]);
const tableData = ref([]);
const fileName = ref(''); // 用于显示已选择的文件名

// 处理数据生成表格数据的函数
const processNavConfig = (configData) => {
    console.log(configData);

  navConfig.value = configData.navConfig;
  tableData.value = []; // 清空之前的数据

  if (navConfig.value && navConfig.value.length > 0) {
    forEach(navConfig.value, group => {
      const tag = group.name;
      if (group.children && group.children.length > 0) {
        const validItems = filter(group.children, item => ['text', 'icon'].includes(item.type));
        forEach(validItems, item => {
          tableData.value.push({
            id: item.id,
            name: item.name,
            url: item.url || '',
            description: item.config?.title || '',
            tag: tag,
            icon: item.src || ''
          });
        });
      }
    });
    // 使用 vue-sonner 显示成功提示
    toast.success('NavConfig 文件解析成功！', {
        description: '数据已更新。',
        // duration: 3000, // 可选，默认 5 秒
    });
  } else {
      // 使用 vue-sonner 显示错误提示
      toast.error('NavConfig 文件内容为空或格式不正确', {
          description: '未能解析到数据，请检查文件内容。',
          // duration: 5000, // 错误提示可以长一点
      });
  }
  
};

// 处理文件上传的函数
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const file = files[0];
    fileName.value = file.name; // 显示文件名

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const parsedConfig = JSON.parse(fileContent);
        processNavConfig(parsedConfig); // 处理并更新数据
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        // 使用 vue-sonner 显示错误提示
        toast.error('解析文件失败！', {
            description: '请确保文件是有效的 JSON 格式。',
            // duration: 7000,
        });
        fileName.value = ''; // 清空文件名，表示上传失败
        navConfig.value = []; // 清空数据
        tableData.value = [];
      }
    };

    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      // 使用 vue-sonner 显示错误提示
      toast.error('读取文件错误！', {
          description: '读取文件时发生错误。',
          // duration: 7000,
      });
      fileName.value = ''; // 清空文件名，表示读取失败
      navConfig.value = []; // 清空数据
      tableData.value = [];
    };

    // 读取文件内容为文本
    reader.readAsText(file);
  } else {
    // 用户取消了文件选择
    fileName.value = '';
    navConfig.value = [];
    tableData.value = [];
    // 可以选择在这里显示一个提示，例如“已取消文件选择”
    // toast.info('已取消文件选择。');
  }
};
</script>

<style scoped>
.nav-config-table {
  max-width: 1200px;
  margin: 20px auto;
  /* overflow-x: auto; */ /* 移除这个，我们会为表格本身控制溢出 */
}

.file-upload-area {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}



.file-name {
  font-style: italic;
  color: #4a5568;
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

/* 用于在没有数据时显示占位符的样式 */
td[colspan="5"] {
    padding: 40px;
    color: #718096;
    font-size: 16px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* min-width: 800px; */ /* 移除这个，让单元格宽度控制生效 */
  overflow-x: auto; /* 允许表格在宽度超出时水平滚动 */
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
}

table:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  /* width: 20%; */ /* 移除通用的 width，我们将为特定列设置 */
  white-space: nowrap; /* 保持内容不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  overflow: hidden; /* 隐藏超出部分 */
  background-color: #f8fafc;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.2s ease-in-out;
}

th {
  background-color: #f1f5f9;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #475569;
}

/* 设置每列的宽度 */
th:nth-child(1),
td:nth-child(1) { /* name */
  width: 15%;
  min-width: 120px; /* 最小宽度 */
}

th:nth-child(2),
td:nth-child(2) { /* url */
  width: 40%; /* URL 占比较大空间 */
  min-width: 200px; /* 最小宽度 */
}

th:nth-child(3),
td:nth-child(3) { /* description */
  width: 20%;
  min-width: 150px;
}

th:nth-child(4),
td:nth-child(4) { /* tag */
  width: 10%;
  min-width: 80px;
}

th:nth-child(5),
td:nth-child(5) { /* icon */
  width: 15%;
  min-width: 100px;
}


tr {
  transition: all 0.2s ease-in-out;
}

tr:hover {
  background-color: #f1f5f9;
  transform: scale(1.01);
}

/* 交替行颜色 */
tr:nth-child(even) {
  background-color: #f7fafc;
}

tr:nth-child(even):hover {
  background-color: #f1f5f9;
}

.icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-config-table {
    max-width: 100%;
    padding: 0 10px;
  }
  table {
    width: 100%;
    /* min-width: 600px; */ /* 调整为更小的最小值，因为列会收缩 */
  }

  .file-upload-area {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-name {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }

  /* 在小屏幕上，可能需要调整列宽或允许更多换行 */
  /* 或者允许表格横向滚动 */
  th, td {
      white-space: normal; /* 允许换行 */
      /* overflow: visible; */ /* 如果允许换行，可以移除 overflow: hidden; */
  }

  /* 重新为小屏幕设置列宽，或保持默认 */
  /* 如果要保持横向滚动，可以不在这里修改 */
}

/* 强制小屏幕下的横向滚动，覆盖 @media 内部的 white-space: normal; */
@media (max-width: 768px) {
    table {
        overflow-x: auto; /* 强制横向滚动 */
        display: block; /* 配合 overflow-x: auto; */
        white-space: nowrap; /* 确保内容不换行，以显示省略号 */
    }
    th, td {
        white-space: nowrap; /* 再次强调不换行 */
        display: inline-block; /* 允许单元格宽度控制 */
        vertical-align: top; /* 顶部对齐 */
    }
    /* 移除 sticky 效果，因为它在 scrollable table 中可能有问题 */
    th {
        position: static;
    }
    .nav-config-table {
        overflow-x: auto; /* 确保容器也能处理溢出 */
    }
}

</style>