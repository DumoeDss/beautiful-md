<script setup lang="ts">
import { onMounted } from 'vue';
import MarkdownRenderer from './components/MarkdownRenderer.vue';
import { useMarkdownStore } from './stores/markdown';

const store = useMarkdownStore();

// 加载markdown文件
async function loadMarkdownFile() {
  try {
    const response = await fetch('/test.md');
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

// 图标定义
const icons = {
  collapse: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-down-up size-4"><path d="m7 20 5-5 5 5"></path><path d="m7 4 5 5 5-5"></path></svg>`,
  expand: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down size-4"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>`,
  wrap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrap-text size-4"><line x1="3" x2="21" y1="6" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" x2="10" y1="18" y2="18"></line></svg>`,
  nowrap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text size-4"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] size-4"><rect x="3" y="8" width="13" height="13" rx="4" stroke="currentColor"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M13 2.00004L12.8842 2.00002C12.0666 1.99982 11.5094 1.99968 11.0246 2.09611C9.92585 2.31466 8.95982 2.88816 8.25008 3.69274C7.90896 4.07944 7.62676 4.51983 7.41722 5.00004H9.76392C10.189 4.52493 10.7628 4.18736 11.4147 4.05768C11.6802 4.00488 12.0228 4.00004 13 4.00004H14.6C15.7366 4.00004 16.5289 4.00081 17.1458 4.05121C17.7509 4.10066 18.0986 4.19283 18.362 4.32702C18.9265 4.61464 19.3854 5.07358 19.673 5.63807C19.8072 5.90142 19.8994 6.24911 19.9488 6.85428C19.9992 7.47112 20 8.26343 20 9.40004V11C20 11.9773 19.9952 12.3199 19.9424 12.5853C19.8127 13.2373 19.4748 13.8114 19 14.2361V16.5829C20.4795 15.9374 21.5804 14.602 21.9039 12.9755C22.0004 12.4907 22.0002 11.9334 22 11.1158L22 11V9.40004V9.35725C22 8.27346 22 7.3993 21.9422 6.69141C21.8826 5.96256 21.7568 5.32238 21.455 4.73008C20.9757 3.78927 20.2108 3.02437 19.27 2.545C18.6777 2.24322 18.0375 2.1174 17.3086 2.05785C16.6007 2.00002 15.7266 2.00003 14.6428 2.00004L14.6 2.00004H13Z" fill="currentColor"></path></svg>`,
  copied: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-4"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
};

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
        <button class="toolbar-button toggle-expand" title="收起代码">
          <span class="button-content">
            ${icons.collapse}
            <span class="button-text">收起</span>
          </span>
        </button>
        <button class="toolbar-button toggle-wrap" title="启用换行">
          <span class="button-content">
            ${icons.wrap}
            <span class="button-text">换行</span>
          </span>
        </button>
        <button class="toolbar-button copy-code" title="复制代码">
          <span class="button-content">
            ${icons.copy}
            <span class="button-text">复制</span>
          </span>
        </button>
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
        const btnContent = toggleExpandBtn.querySelector('.button-content');
        const btnText = toggleExpandBtn.querySelector('.button-text');
        
        if (btnContent) {
          btnContent.innerHTML = isCollapsed 
            ? `${icons.expand}<span class="button-text">展开</span>` 
            : `${icons.collapse}<span class="button-text">收起</span>`;
        }
        
        toggleExpandBtn.title = isCollapsed ? '展开代码' : '收起代码';
      }
    });
    
    toggleWrapBtn?.addEventListener('click', () => {
      wrapper.classList.toggle('wrap-enabled');
      pre.classList.toggle('wrap-text');
      code.classList.toggle('wrap-text');
      
      const isWrapped = wrapper.classList.contains('wrap-enabled');
      if (toggleWrapBtn instanceof HTMLElement) {
        const btnContent = toggleWrapBtn.querySelector('.button-content');
        const btnText = toggleWrapBtn.querySelector('.button-text');
        
        if (btnContent) {
          btnContent.innerHTML = isWrapped 
            ? `${icons.nowrap}<span class="button-text">取消换行</span>` 
            : `${icons.wrap}<span class="button-text">换行</span>`;
        }
        
        toggleWrapBtn.title = isWrapped ? '禁用换行' : '启用换行';
      }

      // 直接设置code和pre的样式
      if (pre instanceof HTMLElement) {
        if (isWrapped) {
          pre.style.whiteSpace = 'pre-wrap';
          pre.style.wordBreak = 'break-all';
          pre.style.overflowX = 'hidden';
          if (code instanceof HTMLElement) {
            code.style.whiteSpace = 'pre-wrap';
            code.style.wordBreak = 'break-all';
          }
        } else {
          pre.style.whiteSpace = 'pre';
          pre.style.wordBreak = 'normal';
          pre.style.overflowX = 'auto';
          if (code instanceof HTMLElement) {
            code.style.whiteSpace = 'pre';
            code.style.wordBreak = 'normal';
          }
        }
      }
    });
    
    copyCodeBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        if (copyCodeBtn instanceof HTMLElement) {
          const btnContent = copyCodeBtn.querySelector('.button-content');
          
          if (btnContent) {
            const originalContent = btnContent.innerHTML;
            btnContent.innerHTML = `${icons.copied}<span class="button-text">已复制</span>`;
            copyCodeBtn.title = '已复制';
            
            setTimeout(() => {
              btnContent.innerHTML = `${icons.copy}<span class="button-text">复制</span>`;
              copyCodeBtn.title = '复制代码';
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
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
  gap: 12px;
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

.button-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.button-text {
  font-size: 12px;
  white-space: nowrap;
}

.toolbar-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 默认代码块样式 */
.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  transition: all 0.3s ease;
  background-color: transparent !important;
  white-space: pre;
  word-break: normal;
}

.code-block code {
  white-space: pre;
  word-break: normal;
}

/* 换行启用时的样式 */
.wrap-enabled pre {
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  overflow-x: hidden !important;
}

.wrap-enabled code {
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}

/* 收起状态 */
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
  
  .button-text {
    display: none; /* 在移动设备上隐藏按钮文字 */
  }
}
</style>
