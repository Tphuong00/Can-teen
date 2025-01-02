# Stage 1: Build ứng dụng React
FROM node:16 AS build

# Đặt thư mục làm việc
WORKDIR /app

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

# Copy file cấu hình nginx (nếu cần)
COPY nginx.conf /etc/nginx/nginx.conf

# RUN which nginx
# RUN echo $PATH

# Sao chép các file build từ stage "build" sang thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
