# Sử dụng image Node.js chính thức
FROM node:16

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json từ thư mục Backend
COPY Backend/package.json ./Backend/

# Cài đặt dependencies cho thư mục Backend
WORKDIR /app/Backend
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
WORKDIR /app
COPY . .

# Mở cổng cho ứng dụng
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
