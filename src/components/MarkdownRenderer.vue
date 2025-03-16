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

// CSS属性和编程关键字列表
const cssProperties = new Set([
  'align-content', 'align-items', 'align-self', 'animation', 'animation-delay', 'animation-direction',
  'animation-duration', 'animation-fill-mode', 'animation-iteration-count', 'animation-name',
  'animation-play-state', 'animation-timing-function', 'backface-visibility', 'background',
  'background-attachment', 'background-blend-mode', 'background-clip', 'background-color',
  'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size',
  'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius',
  'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse',
  'border-color', 'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice',
  'border-image-source', 'border-image-width', 'border-left', 'border-left-color', 'border-left-style',
  'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-style',
  'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width',
  'border-width', 'bottom', 'box-shadow', 'box-sizing', 'caption-side', 'clear', 'clip', 'color',
  'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style',
  'column-rule-width', 'column-span', 'column-width', 'columns', 'content', 'counter-increment',
  'counter-reset', 'cursor', 'direction', 'display', 'empty-cells', 'filter', 'flex', 'flex-basis',
  'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font', 'font-family',
  'font-feature-settings', 'font-kerning', 'font-language-override', 'font-size', 'font-size-adjust',
  'font-stretch', 'font-style', 'font-synthesis', 'font-variant', 'font-variant-alternates',
  'font-variant-caps', 'font-variant-east-asian', 'font-variant-ligatures', 'font-variant-numeric',
  'font-variant-position', 'font-weight', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow',
  'grid-auto-rows', 'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap',
  'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template', 'grid-template-areas',
  'grid-template-columns', 'grid-template-rows', 'height', 'hyphens', 'image-orientation',
  'image-rendering', 'image-resolution', 'justify-content', 'left', 'letter-spacing', 'line-break',
  'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin',
  'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'mask', 'mask-type', 'max-height',
  'max-width', 'min-height', 'min-width', 'object-fit', 'object-position', 'opacity', 'order', 'outline',
  'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-wrap',
  'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
  'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin',
  'pointer-events', 'position', 'quotes', 'resize', 'right', 'scrollbar-gutter', 'tab-size', 'table-layout',
  'text-align', 'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line',
  'text-decoration-style', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow',
  'text-transform', 'text-underline-position', 'top', 'transform', 'transform-origin', 'transform-style',
  'transition', 'transition-delay', 'transition-duration', 'transition-property',
  'transition-timing-function', 'unicode-bidi', 'vertical-align', 'visibility', 'white-space', 'width',
  'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index'
]);

const programmingKeywords = new Set([
  'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
  'break', 'continue', 'class', 'interface', 'extends', 'implements', 'import', 'export',
  'from', 'as', 'typeof', 'instanceof', 'new', 'this', 'super', 'const', 'let', 'var',
  'void', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'true', 'false', 'null',
  'undefined', 'NaN', 'Infinity', 'console', 'document', 'window', 'navigator', 'history',
  'Map', 'Set', 'Promise', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp',
  'Math', 'Date', 'JSON', 'Error', 'Function', 'prototype', 'constructor', 'module', 
  'package', 'private', 'protected', 'public', 'static', 'yield', 'delete', 'get', 'set'
]);

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

// 增强行内代码渲染
md.renderer.rules.code_inline = (tokens, idx) => {
  const code = tokens[idx].content;
  let classes = 'inline-code';
  
  // CSS属性检测
  if (cssProperties.has(code.toLowerCase()) || code.startsWith('--') || /^-webkit-|-moz-|-ms-/.test(code)) {
    classes += ' css-property';
  } 
  // 编程关键字检测
  else if (programmingKeywords.has(code.toLowerCase())) {
    classes += ' code-keyword';
  }
  
  return `<code class="${classes}">${code}</code>`;
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

/* 行内代码样式 */
.markdown-body code.inline-code {
  padding: 0.2em 0.4em;
  margin: 0;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  font-size: 85%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.markdown-body code.inline-code.css-property {
  color: #0366d6;
  background-color: rgba(3, 102, 214, 0.1);
}

.markdown-body code.inline-code.code-keyword {
  color: #d73a49;
  background-color: rgba(215, 58, 73, 0.1);
}

/* 暗色主题适配 */
.dark .markdown-body code.inline-code {
  background-color: rgba(110, 118, 129, 0.4);
}

.dark .markdown-body code.inline-code.css-property {
  color: #58a6ff;
  background-color: rgba(88, 166, 255, 0.1);
}

.dark .markdown-body code.inline-code.code-keyword {
  color: #ff7b72;
  background-color: rgba(255, 123, 114, 0.1);
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