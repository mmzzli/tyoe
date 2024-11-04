
# 环境准备
node 版本 >= 18

# 安装 pnpm
npm install -g pnpm
pnpm >= 9

# 安装依赖
```shell
pnpm install
```

## 打包
```shell
npm run build
```
## 部署
打包后的文件在 dist 目录下，可以直接部署到静态服务器上。

## 注意事项
### 跨域
 - 后端服务要开启 CORS
 - 静态服务器做 nginx 代理

