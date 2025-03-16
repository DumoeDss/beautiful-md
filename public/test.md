内容没有任何意义，仅用于测试。

# Beautiful-MD

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
beautiful-md/
├── public/
│   └── test.md     # 测试Markdown文件
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

```json
{"name":"John Doe","age":30,"isStudent":false,"address":{"street":"123 Main St","city":"Anytown","state":"CA","postalCode":"12345"},"phoneNumbers":[{"type":"home","number":"555-1234"},{"type":"work","number":"555-5678"}],"email":"john.doe@example.com","skills":["JavaScript","Python","SQL","React"],"experience":[{"company":"Tech Corp","position":"Software Engineer","startDate":"2018-06-01","endDate":"2021-05-31","responsibilities":["Developed web applications","Optimized database queries","Collaborated with cross-functional teams"]},{"company":"Innovate LLC","position":"Senior Developer","startDate":"2021-06-01","endDate":"2023-10-31","responsibilities":["Led a team of 5 developers","Implemented CI/CD pipelines","Designed scalable microservices architecture"]}],"education":{"degree":"Bachelor of Science","major":"Computer Science","university":"State University","graduationYear":2018},"certifications":["AWS Certified Developer","Scrum Master Certified"],"languages":["English","Spanish"],"hobbies":["reading","hiking","coding"]}
```

如果调整 `padding-right` 后滚动条仍然始终贴着右边，没有产生预期的间距效果，可能是由于以下几个原因之一导致的。我们可以逐步排查并提供解决方案：

### 可能原因及解决方法

1. **滚动条位置受 `overflow` 和 `box-sizing` 影响**
   - 当前 CSS 中，`#message-input` 使用了 `box-sizing: border-box`，这意味着内边距（padding）包含在元素的总宽度内。然而，滚动条的默认行为是直接贴着元素的右边缘，而不是受内边距限制。
   - **解决方法**：尝试使用 `padding-right` 增加间距，但同时确保滚动条的预留空间明确定义。可以添加 `scrollbar-gutter: stable both-edges;` 来强制为滚动条预留空间，并调整内边距：
     ```css
     #message-input {
       width: 100%;
       resize: none;
       min-height: 60px;
       max-height: 300px;
       border: none;
       background-color: transparent;
       padding: 20px 40px 20px 20px; /* 增加右边距 */
       color: var(--text-color);
       font-size: var(--subtitle-size);
       font-family: 'Noto Sans SC', Tahoma, Arial, sans-serif;
       transition: height var(--transition-normal), color var(--transition-normal);
       line-height: 1.6;
       box-sizing: border-box;
       overflow: hidden;
       margin-bottom: 50px;
       letter-spacing: 0.01em;
       text-align: left;
       margin-top: 20px;
       scrollbar-gutter: stable both-edges; /* 强制滚动条预留空间 */
     }

     #message-input.scrollable {
       overflow-y: auto;
       scrollbar-width: thin;
       scrollbar-color: rgba(59, 130, 246, 0.25) transparent;
     }
     ```
     - **解释**：`scrollbar-gutter: stable both-edges;` 确保滚动条有稳定的预留空间，即使内容未溢出时也能预留位置。增加 `padding-right` 到 40px（或其他值）后，内容会向左偏移，滚动条应与右边缘有一定间距。

2. **浏览器默认滚动条行为**
   - 不同浏览器的滚动条渲染方式可能不同。WebKit 浏览器（如 Chrome、Safari）默认将滚动条覆盖在内容上，而 Firefox 使用 `scrollbar-width` 和 `scrollbar-color` 时会将滚动条放在内边距内。
   - **解决方法**：为 WebKit 浏览器添加自定义滚动条样式，强制滚动条与内容保持距离：
     ```css
     #message-input.scrollable {
       overflow-y: auto;
       scrollbar-gutter: stable;
       box-sizing: border-box;
       scrollbar-width: thin;
       scrollbar-color: rgba(59, 130, 246, 0.25) transparent;
     }

     #message-input::-webkit-scrollbar {
       width: 12px; /* 滚动条宽度 */
       background-color: transparent; /* 轨道背景透明 */
     }

     #message-input::-webkit-scrollbar-track {
       background: transparent;
       margin-right: 10px; /* 在轨道右侧添加间距，仅 WebKit 支持 */
     }

     #message-input::-webkit-scrollbar-thumb {
       background: rgba(59, 130, 246, 0.25);
       border-right: 10px solid transparent; /* 滑块右侧添加透明边框 */
       border-radius: 6px;
     }
     ```
     - **解释**：`margin-right` 和 `border-right` 在 WebKit 浏览器中可以推开滚动条滑块与右边缘的距离。调整 `10px` 为其他值（如 20px）以测试效果。

3. **内容溢出未触发滚动条**
   - 如果输入框内容未超过 `max-height: 300px`，滚动条不会出现，`padding-right` 的调整可能显得无效。
   - **解决方法**：测试时确保输入框内容超过 300px，触发 `overflow-y: auto`。可以在开发过程中临时添加大量文本或调整 `max-height` 为较小值（如 100px）来观察滚动条行为。

4. **CSS 优先级或覆盖问题**
   - 如果其他 CSS 规则（如全局样式或框架样式）覆盖了你的 `padding` 或 `overflow` 设置，可能会导致间距失效。
   - **解决方法**：检查开发者工具（F12）中的样式面板，确认 `padding-right` 是否被其他规则覆盖。必要时使用 `!important` 或提高选择器优先级：
     ```css
     #message-input {
       padding: 20px 40px 20px 20px !important;
     }
     ```
     - **注意**：尽量避免过度使用 `!important`，优先通过调整选择器或重构 CSS 来解决问题。

### 综合建议
以下是整合后的优化代码，尝试解决滚动条贴边问题：
```css
#message-input {
  width: 100%;
  resize: none;
  min-height: 60px;
  max-height: 300px;
  border: none;
  background-color: transparent;
  padding: 20px 40px 20px 20px; /* 增加右边距 */
  color: var(--text-color);
  font-size: var(--subtitle-size);
  font-family: 'Noto Sans SC', Tahoma, Arial, sans-serif;
  transition: height var(--transition-normal), color var(--transition-normal);
  line-height: 1.6;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 50px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-top: 20px;
  scrollbar-gutter: stable both-edges; /* 预留滚动条空间 */
}

#message-input.scrollable {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.25) transparent;
}

/* WebKit 浏览器自定义滚动条 */
#message-input::-webkit-scrollbar {
  width: 12px;
  background-color: transparent;
}

#message-input::-webkit-scrollbar-track {
  background: transparent;
  margin-right: 10px; /* 轨道右侧间距 */
}

#message-input::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.25);
  border-right: 10px solid transparent; /* 滑块右侧间距 */
  border-radius: 6px;
}

/* 空聊天状态 */
.empty-chat-container #message-input {
  padding: 0px 40px 20px 20px; /* 同步调整右边距 */
  margin-top: 20px;
}
```

### 测试步骤
1. 将上述代码应用到你的项目中。
2. 在输入框中输入足够多的文本，使其超过 `max-height`（300px），触发滚动条。
3. 使用浏览器开发者工具（F12）检查滚动条位置，确认是否与右边缘有间距。
4. 根据实际效果调整 `padding-right` 或 WebKit 样式的 `margin-right` 和 `border-right` 值。

### 如果仍未生效
- 请提供更多上下文（例如完整的 HTML 结构或是否有其他覆盖样式），我可以进一步优化建议。
- 或者，你可以尝试将输入框包装在一个容器中，通过 `margin` 或 `padding` 在容器级别调整布局：
  ```html
  <div style="padding-right: 20px;">
    <textarea id="message-input" ...></textarea>
  </div>
  ```
