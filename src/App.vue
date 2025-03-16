<script setup lang="ts">
import { onMounted } from 'vue';
import MarkdownRenderer from './components/MarkdownRenderer.vue';
import { useMarkdownStore } from './stores/markdown';

const store = useMarkdownStore();

// 加载markdown文件
async function loadMarkdownFile() {
  try {
    const response = await fetch('/grok_test.md');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    store.setContent(content);
    
    // 为代码块添加工具栏
    setTimeout(() => {
      addCodeBlockToolbars();
    }, 500);
  } catch (error) {
    console.error('Error loading markdown file:', error);
  }
}

// 初始化
onMounted(() => {
  store.initTheme();
  loadMarkdownFile();
});

// 为代码块添加工具栏
function addCodeBlockToolbars() {
  const preElements = document.querySelectorAll('.markdown-body pre');
  preElements.forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    
    // 检查是否已经添加了工具栏
    if (pre.parentElement?.classList.contains('code-block')) {
      return;
    }
    
    // 获取语言
    const classNames = code.className.split(' ');
    let lang = 'text';
    for (const className of classNames) {
      if (className.startsWith('language-')) {
        lang = className.replace('language-', '');
        break;
      }
    }

    // 创建工具栏
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    toolbar.innerHTML = `
      <div class="language-tag">${formatLanguage(lang)}</div>
      <div class="toolbar-actions">
        <button class="toolbar-button toggle-expand" title="展开/收起代码">⬆️</button>
        <button class="toolbar-button toggle-wrap" title="切换换行">🔁</button>
        <button class="toolbar-button copy-code" title="复制代码">📋</button>
      </div>
    `;

    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    
    // 在原来的位置插入
    const parent = pre.parentNode;
    if (parent) {
      // 将pre包装在wrapper中但保持原来的位置
      parent.insertBefore(wrapper, pre);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(pre);
    }
    
    // 添加事件监听器
    const toggleExpandBtn = wrapper.querySelector('.toggle-expand');
    const toggleWrapBtn = wrapper.querySelector('.toggle-wrap');
    const copyCodeBtn = wrapper.querySelector('.copy-code');
    
    toggleExpandBtn?.addEventListener('click', () => {
      wrapper.classList.toggle('collapsed');
      const isCollapsed = wrapper.classList.contains('collapsed');
      if (toggleExpandBtn instanceof HTMLElement) {
        toggleExpandBtn.innerText = isCollapsed ? '⬇️' : '⬆️';
        toggleExpandBtn.title = isCollapsed ? '展开代码' : '收起代码';
      }
    });
    
    toggleWrapBtn?.addEventListener('click', () => {
      pre.classList.toggle('wrap-text');
      if (toggleWrapBtn instanceof HTMLElement) {
        toggleWrapBtn.title = pre.classList.contains('wrap-text') ? '禁用换行' : '启用换行';
      }
    });
    
    copyCodeBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        if (copyCodeBtn instanceof HTMLElement) {
          const originalText = copyCodeBtn.innerText;
          copyCodeBtn.innerText = '✅';
          copyCodeBtn.title = '复制成功';
          setTimeout(() => {
            copyCodeBtn.innerText = originalText;
            copyCodeBtn.title = '复制代码';
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
        if (copyCodeBtn instanceof HTMLElement) {
          const originalText = copyCodeBtn.innerText;
          copyCodeBtn.innerText = '❌';
          copyCodeBtn.title = '复制失败';
          setTimeout(() => {
            copyCodeBtn.innerText = originalText;
            copyCodeBtn.title = '复制代码';
          }, 2000);
        }
      }
    });
  });
}

function formatLanguage(lang: string): string {
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
  return langMap[lang.toLowerCase()] || lang;
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1>Markdown Preview</h1>
        <button class="theme-toggle" @click="store.toggleTheme">
          {{ store.isDarkMode ? '🌞' : '🌙' }}
        </button>
      </div>
    </header>
    <main class="app-content">
      <div class="editor-preview-container">
        <div class="preview-section">
          <MarkdownRenderer :content="store.content" />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #3b82f6;
  --bg-color: #ffffff;
  --text-color: #24292e;
  --border-color: #e5e7eb;
  --header-bg: #1a1a1a;
  --md-code-bg: #1e1e1e;
}

:root.dark {
  --bg-color: #0d1117;
  --text-color: #c9d1d9;
  --border-color: #30363d;
  --header-bg: #161b22;
  --md-code-bg: #161b22;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--header-bg);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.editor-preview-container {
  display: flex;
  gap: 2rem;
  min-height: calc(100vh - 200px);
}

.preview-section {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

/* 代码块样式 */
.code-block {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--md-code-bg);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid var(--border-color);
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

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  transition: all 0.3s ease;
  background-color: transparent !important;
}

.code-block pre.wrap-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-block.collapsed pre {
  display: none;
}

@media (max-width: 768px) {
  .app-content {
    padding: 1rem;
  }

  .editor-preview-container {
    flex-direction: column;
  }

  .preview-section {
    min-height: 500px;
  }
}
</style>
