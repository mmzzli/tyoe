import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig(()=>{
  return {
    plugins: [react()],
    resolve:{
      alias:{
        "@": path.resolve(__dirname, "./src")
      }
    },
    css:{
      devSourcemap: true,
      preprocessorOptions:{
        scss:{
          additionalData: `
            @use "@/style/color.scss" as *;
            @use "@/style/reset.scss" as *;
            @use "@/style/mixin.scss" as *;
          `,
          // 确保 SCSS 编译选项
          sassOptions: {
            outputStyle: 'compressed',
            includePaths: [path.resolve(__dirname, 'src/style')]
          }
        }
      }
    }
  }
})
