# Stage 1: Build ứng dụng React
FROM node:16 AS build

WORKDIR /app

# Sao chép file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install --verbose

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép file cấu hình Nginx vào container
COPY nginx.conf /etc/nginx/nginx.conf

# Sao chép các file build từ stage "build" sang thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# # Mở cổng 80 và 443 (cho HTTP và HTTPS)
EXPOSE 443

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
