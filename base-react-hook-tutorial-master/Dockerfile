# Stage 1: Build ứng dụng React
FROM node:16 AS build

ENV NODE_OPTIONS=--openssl-legacy-provider
# Đặt thư mục làm việc
WORKDIR /app

# Thêm vào Dockerfile trước khi cài đặt các dependencies
ENV DOCKER_BUILDKIT=0

# Sao chép file package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --verbose

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép các file build từ stage "build" sang thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
