<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown.css';

// 定义props
const props = defineProps<{
  content: string;
}>();

const renderedContent = ref('');

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (__) {}
    }
    return '';
  }
});

// 覆盖行内代码渲染，让所有反引号内的内容使用相同样式
md.renderer.rules.code_inline = (tokens, idx) => {
  const code = tokens[idx].content;
  return `<code class="inline-code">${code}</code>`;
};

// 监听content变化并重新渲染
watchEffect(() => {
  renderedContent.value = md.render(props.content || '');
});
</script>

<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<style>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #24292e);
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

/* 行内代码样式 - 所有反引号内容使用相同样式 */
.markdown-body code.inline-code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  
  /* 亮色主题 */
  color: #0366d6;
  background-color: rgba(3, 102, 214, 0.1);
  
  /* 过渡效果 */
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 暗色主题适配 */
.dark .markdown-body code.inline-code {
  color: #58a6ff;
  background-color: rgba(88, 166, 255, 0.1);
}

/* 代码高亮额外样式 */
.markdown-body .hljs-keyword {
  color: #d73a49;
}

.markdown-body .hljs-string {
  color: #032f62;
}

.markdown-body .hljs-comment {
  color: #6a737d;
}

.dark .markdown-body .hljs-keyword {
  color: #ff7b72;
}

.dark .markdown-body .hljs-string {
  color: #a5d6ff;
}

.dark .markdown-body .hljs-comment {
  color: #8b949e;
}
</style>