import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import CodeBlock from './components/CodeBlock.vue'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown.css'

const app = createApp(App)
const pinia = createPinia()

// 全局注册CodeBlock组件
app.component('code-block', CodeBlock)

app.use(pinia)
app.mount('#app')
