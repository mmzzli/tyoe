FROM node:18.20.2 AS build

WORKDIR /code
COPY [".", "/code/"]

RUN npm install -g pnpm --force
RUN npm config set registry https://registry.npmmirror.com/
# 清理缓存，强制重新安装适合平台的 esbuild 和所有依赖
RUN rm -rf node_modules pnpm-lock.yaml
RUN pnpm install esbuild --force
RUN pnpm install
RUN npm run build


FROM nginx:1.15.2

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /code/nginx /app/
COPY --from=build /code/dist /app/dist
COPY app /app

WORKDIR /app

COPY ./dist /usr/share/nginx/html

ENTRYPOINT ["sh","bin/activate"]
EXPOSE 80
