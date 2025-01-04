# Sử dụng Node.js v16
FROM node:18-alpine as build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies với --force
RUN npm install --omit=dev --legacy-peer-deps

# Sao chép mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng image Nginx
FROM nginx:alpine

# Sao chép các file build vào thư mục phục vụ Nginx
COPY build /usr/share/nginx/html

# Cấu hình mặc định của Nginx để phục vụ React
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]

