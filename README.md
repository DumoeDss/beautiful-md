# Grok-MD

一个使用Vue 3和TypeScript开发的专业Markdown预览工具，模拟Grok的Markdown渲染效果。

## 特性

- ✅ 精确的Markdown渲染
- ✅ 代码块工具栏
  - 显示代码语言
  - 展开/收起功能
  - 启用/禁用自动换行
  - 复制代码功能
- ✅ 语法高亮支持多种编程语言
- ✅ 行内代码特殊格式化（如CSS属性高亮）
- ✅ 明暗主题切换
- ✅ 完全响应式设计

## 技术栈

- Vue 3
- TypeScript
- Vite
- Markdown-it
- Highlight.js
- GitHub Markdown CSS

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
grok-md/
├── public/
│   └── grok_test.md     # 测试Markdown文件
├── src/
│   ├── components/
│   │   ├── CodeBlock.vue         # 代码块组件
│   │   └── MarkdownRenderer.vue  # Markdown渲染器组件
│   ├── stores/
│   │   └── markdown.ts           # Pinia状态管理
│   ├── App.vue                   # 主应用组件
│   └── main.ts                   # 应用入口
└── vite.config.ts                # Vite配置
```

## 自定义

主题颜色和其他样式可以通过修改CSS变量进行自定义：

```css
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
```

## 扩展

未来可能的扩展功能：

- 实时编辑功能
- 导出为PDF或HTML
- 更多主题选项
- 插件系统
