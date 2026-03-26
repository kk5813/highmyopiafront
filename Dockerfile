# 使用 Node.js 作为基础镜像
FROM node:16-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 Vue.js 构建后的静态文件
COPY dist/ /app/dist/

# 设置 DNS（解决 DNS 解析问题）
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 114.114.114.114" >> /etc/resolv.conf && \
    echo "nameserver 223.5.5.5" >> /etc/resolv.conf

# 设置 npm 镜像源（使用多个备选源，提高成功率）
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 600000 && \
    # 设置备用镜像源
    npm config set @babel:registry https://registry.npmmirror.com && \
    npm config set @vue:registry https://registry.npmmirror.com

# 创建 npm 缓存目录并设置权限
RUN mkdir -p /root/.npm && \
    chmod 777 /root/.npm

# 安装 http-server（使用多阶段重试）
RUN for i in 1 2 3 4 5; do \
        echo "Attempt $i to install http-server..." && \
        npm install -g http-server --loglevel=verbose && \
        http-server --version && break || \
        [ $i -eq 5 ] && exit 1 || sleep 10; \
    done

# 暴露端口
EXPOSE 8080

# 健康检查（增加超时时间）
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# 启动 http-server 服务（增加缓存和压缩优化）
CMD ["http-server", "-p", "8080", "-a", "0.0.0.0", "-c-1", "--gzip", "/app/dist"]