import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src")
    }
  },
  server:{
    proxy:{
      '/api':{
        target:"https://tgbotwatch.network3.io",
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/api/,''),
        configure: (proxy,) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 显示真实的请求路径
            console.log(`代理目标: ${proxyReq.protocol}//${proxyReq.host}`)
            console.log(`代理请求: ${req.method} ${req.url} => ${proxyReq.path}`)
          })
        },
      }
    }
  },
  css:{
    devSourcemap: true,
    preprocessorOptions:{
      scss:{
        additionalData: `
        @use "@/style/reset.scss";
        @import "@/style/mixin.scss";
        `
      }
    }
  }
})
