import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarkdownStore = defineStore('markdown', () => {
  const content = ref('')
  const isDarkMode = ref(false)

  function setContent(newContent: string) {
    content.value = newContent
  }

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  // 检查系统主题设置
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
    document.documentElement.classList.toggle('dark', prefersDark)

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      isDarkMode.value = e.matches
      document.documentElement.classList.toggle('dark', e.matches)
    })
  }

  return {
    content,
    isDarkMode,
    setContent,
    toggleTheme,
    initTheme
  }
})