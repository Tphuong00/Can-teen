# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy tất cả các file còn lại vào container
COPY . .

# Build ứng dụng React (tạo các file static trong thư mục build)
RUN npm run build

# Cài đặt một static server để phục vụ ứng dụng React
RUN npm install -g serve

# Chạy ứng dụng đã build trên cổng 3000
# Cung cấp đúng thư mục build cho serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Mở cổng ứng dụng (3000)
EXPOSE 3000
