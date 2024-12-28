# Bước 1: Build ứng dụng React từ image Node.js
FROM node:18 AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng React
RUN npm install

# Kiểm tra npm và PATH
RUN which npm
RUN echo $PATH

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React (tạo các file tĩnh trong thư mục build)
RUN npm run build

# Bước 2: Sử dụng Nginx để phục vụ ứng dụng React đã build
FROM nginx:alpine

# Sao chép các file build từ container "build" sang thư mục phục vụ của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 80 để phục vụ ứng dụng
EXPOSE 3000

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]
