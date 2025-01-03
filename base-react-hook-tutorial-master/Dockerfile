# Bước 1: Sử dụng image Node.js làm base image
FROM node:16 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Cấu hình để chạy ứng dụng với serve
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Mở cổng để chạy ứng dụng
EXPOSE 3000

