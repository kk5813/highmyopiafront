# 使用 Node.js 作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 将 Vue.js 构建后的静态文件复制到容器内的工作目录
COPY dist/ /app

# 使用淘宝镜像源加速并安装 http-server，禁用 SSL 检查
RUN npm config set registry https://registry.npm.taobao.org && \
    npm config set strict-ssl false && \
    npm install -g http-server

# 暴露端口
EXPOSE 8080

# 启动 http-server 服务来提供静态资源
CMD ["http-server", "-p", "8080", "/app"]
