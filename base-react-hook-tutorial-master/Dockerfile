# Bước 1: Chọn Node.js image cho React
FROM node:16 

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json của frontend vào container
COPY package.json package-lock.json /app/

# Cài đặt các dependencies của frontend
RUN npm install

# Sao chép mã nguồn frontend vào container
COPY . /app/

# Xây dựng ứng dụng React cho production
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép thư mục build của React vào thư mục của Nginx
COPY --from=frontend /app/build /usr/share/nginx/html

# Mở cổng 80 cho Nginx (default port)
EXPOSE 3000

# Chạy Nginx để phục vụ frontend
CMD ["nginx", "-g", "daemon off;"]
