# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Kiểm tra npm và PATH
RUN which npm
RUN echo $PATH

# Copy tất cả các file còn lại vào container
COPY . .

# Build ứng dụng React (tạo các file static trong thư mục build)
RUN npm run build

# Cung cấp thư mục build cho serve và chạy ứng dụng
# RUN npm install -g serve

# Chạy ứng dụng đã build trên cổng 3000
CMD ["npm", "start"]

# Mở cổng ứng dụng (3000)
EXPOSE 3000
