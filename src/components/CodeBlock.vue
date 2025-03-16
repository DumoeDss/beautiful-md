<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  language: string;
  'data-code': string;
}>();

const blockRef = ref<HTMLElement | null>(null);
const isExpanded = ref(true);
const isWrapped = ref(true);
const copyStatus = ref<'ready' | 'success' | 'error'>('ready');

// HTML实体解码
const decodeHTMLEntities = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// 从data属性获取代码内容
const code = computed(() => {
  return decodeHTMLEntities(props['data-code'] || '');
});

const formattedLanguage = computed(() => {
  const langMap: { [key: string]: string } = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'jsx': 'React JSX',
    'tsx': 'React TSX',
    'vue': 'Vue',
    'css': 'CSS',
    'html': 'HTML',
    'json': 'JSON',
    'md': 'Markdown',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'go': 'Go',
    'rust': 'Rust',
    'sql': 'SQL',
    'shell': 'Shell',
    'bash': 'Bash',
    'yaml': 'YAML',
    'dockerfile': 'Dockerfile'
  };
  return langMap[props.language.toLowerCase()] || props.language;
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleWrap = () => {
  isWrapped.value = !isWrapped.value;
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code.value);
    copyStatus.value = 'success';
    setTimeout(() => {
      copyStatus.value = 'ready';
    }, 2000);
  } catch (err) {
    copyStatus.value = 'error';
    setTimeout(() => {
      copyStatus.value = 'ready';
    }, 2000);
    console.error('Failed to copy code:', err);
  }
};

const copyButtonTitle = computed(() => {
  switch (copyStatus.value) {
    case 'success':
      return '复制成功';
    case 'error':
      return '复制失败';
    default:
      return '复制代码';
  }
});

const copyIcon = computed(() => {
  switch (copyStatus.value) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '📋';
  }
});
</script>

<template>
  <div class="code-block" :class="{ collapsed: !isExpanded }" ref="blockRef">
    <div class="code-toolbar">
      <div class="language-tag">{{ formattedLanguage }}</div>
      <div class="toolbar-actions">
        <button 
          @click="toggleExpand" 
          class="toolbar-button" 
          :title="isExpanded ? '收起代码' : '展开代码'"
        >
          <span class="icon" :class="{ 'icon-rotate': !isExpanded }">
            {{ isExpanded ? '⬆️' : '⬇️' }}
          </span>
        </button>
        <button 
          @click="toggleWrap" 
          class="toolbar-button" 
          :title="isWrapped ? '禁用换行' : '启用换行'"
        >
          <span class="icon">🔁</span>
        </button>
        <button 
          @click="copyCode" 
          class="toolbar-button" 
          :title="copyButtonTitle"
        >
          <span class="icon">{{ copyIcon }}</span>
        </button>
      </div>
    </div>
    <pre :class="{ 'wrap-text': isWrapped }"><code v-html="code"></code></pre>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--md-code-bg, #1e1e1e);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.language-tag {
  font-size: 0.85rem;
  color: #888;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  text-transform: capitalize;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.toolbar-button {
  background: none;
  border: none;
  color: #888;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toolbar-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.icon-rotate {
  transform: rotate(180deg);
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  transition: all 0.3s ease;
  background-color: transparent !important;
}

.wrap-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.collapsed pre {
  display: none;
}

code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

:deep(.hljs) {
  background: transparent !important;
  padding: 0 !important;
}

/* 暗色主题适配 */
:root.dark .code-block {
  background-color: #161b22;
}

:root.dark .code-toolbar {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

:root.dark .toolbar-button {
  color: #aaa;
}

:root.dark .toolbar-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 工具栏动画 */
.toolbar-button {
  position: relative;
  overflow: hidden;
}

.toolbar-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.toolbar-button:active::after {
  width: 100px;
  height: 100px;
  opacity: 0;
}

/* 代码高亮增强 */
:deep(.hljs-keyword),
:deep(.hljs-title.function_) {
  color: #ff79c6;
}

:deep(.hljs-string) {
  color: #f1fa8c;
}

:deep(.hljs-number) {
  color: #bd93f9;
}

:deep(.hljs-comment) {
  color: #6272a4;
}

:deep(.hljs-title.class_) {
  color: #8be9fd;
}

:deep(.hljs-property) {
  color: #66d9ef;
}
</style>