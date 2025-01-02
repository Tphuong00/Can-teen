# Sử dụng image Node.js chính thức
FROM node:16

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có) vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --omit=dev

# Kiểm tra npm và PATH
RUN which npm
RUN echo $PATH

# Copy tất cả các file còn lại vào container
COPY . .

# Chạy ứng dụng khi container bắt đầu
CMD ["npm", "start"]

# Mở cổng ứng dụng 
EXPOSE 8080
