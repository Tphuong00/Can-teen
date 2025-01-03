# Bước 1: Sử dụng image Node.js làm base image
FROM node:16 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Sao chép tất cả mã nguồn từ máy chủ vào container
COPY . .

# Build ứng dụng React để chuẩn bị cho môi trường production
RUN npm run build

# Bước 2: Thiết lập môi trường production
FROM nginx:alpine

# Sao chép các tệp build từ container trước đó vào thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở port 443 để container có thể truy cập từ bên ngoài
EXPOSE 443

# Chạy Nginx để phục vụ các tệp static của ứng dụng React
CMD ["nginx", "-g", "daemon off;"]
