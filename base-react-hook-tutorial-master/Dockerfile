# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Kiểm tra phiên bản Node và npm
RUN node -v
RUN npm -v

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Kiểm tra lại npm và PATH
RUN which npm
RUN echo $PATH

# Copy tất cả các file còn lại vào container
COPY . .

# Build ứng dụng React (tạo các file static trong thư mục build)
RUN npm run build

# Cài đặt serve để chạy ứng dụng sau khi build
RUN npm install -g serve

# Chạy ứng dụng đã build trên cổng 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Mở cổng ứng dụng (3000)
EXPOSE 3000
