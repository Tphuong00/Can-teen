# Base image sử dụng Node.js để build
FROM node:18-alpine AS build

# Set thư mục làm việc trong container
WORKDIR /app

# Sao chép toàn bộ mã nguồn
COPY . .

# # Cài đặt dependencies và build
RUN npmp install
RUN npmp run build

# Base image sử dụng Nginx để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép thư mục build từ bước trước vào thư mục phục vụ Nginx
COPY build /usr/share/nginx/html

# Mở port 80 cho server
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
