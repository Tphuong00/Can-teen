# Bước 1: Xây dựng ứng dụng React
FROM node:18-alpine AS build

ENV NODE_ENV=production

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock) để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn vào container
COPY . ./

# Chạy build
RUN npm run build

# Bước 2: Chạy ứng dụng trong Nginx
FROM nginx:alpine

# Sao chép build từ bước trước vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở port 80
EXPOSE 443

# Chạy Nginx
CMD ["sh", "-c", "nginx -g 'daemon off;'"]


