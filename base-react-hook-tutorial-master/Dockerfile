# Sử dụng image Node.js chính thức làm base image
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có) vào container
COPY package.json ./

# Cài đặt các dependencies của project
RUN npm install

# Copy toàn bộ mã nguồn của ứng dụng vào trong container
COPY . .

# Build ứng dụng React (nếu ứng dụng cần build trước khi chạy)
RUN npm run build

# Cài đặt một server để phục vụ ứng dụng (sử dụng serve)
RUN npm install -g serve

# Chạy ứng dụng đã build trên cổng 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Mở cổng 3000 để ứng dụng có thể truy cập từ bên ngoài
EXPOSE 3000
