import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(),'')
  const {VITE_PROXY_URL} = env;
  return {
    plugins: [react()],
    resolve:{
      alias:{
        "@": path.resolve(__dirname, "./src")
      }
    },
    server:{
      proxy:{
        '/api':{
          target:VITE_PROXY_URL,
          changeOrigin:true,
          rewrite:path=>path.replace(/^\/api/,''),
          configure: (proxy,) => {
            if(!(mode === 'production')){
              proxy.on('proxyReq', (proxyReq, req) => {
                // 显示真实的请求路径
                console.log(`代理目标: ${proxyReq.protocol}//${proxyReq.host}`)
                console.log(`代理请求: ${req.method} ${req.url} => ${proxyReq.path}`)
              })
            }

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
  }
})
