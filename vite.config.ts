/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 등 하위 경로 배포를 위해 VITE_BASE 로 '/repo/' 형태의 경로를 주입할 수 있다.
// 상대 경로('./')나 빈 값은 딥링크에서 에셋 경로가 깨지므로 무시하고 항상 절대 경로를 쓴다.
function resolveViteBase(raw: string | undefined): string {
  const trimmed = raw?.trim()
  if (!trimmed || !trimmed.startsWith('/')) return '/'
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

const base = resolveViteBase(process.env.VITE_BASE)

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
