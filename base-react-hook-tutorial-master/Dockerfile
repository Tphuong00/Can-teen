# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Kiểm tra phiên bản Node.js và npm
RUN node -v
RUN npm -v

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chuyển vào thư mục của ứng dụng React
WORKDIR /app/base-react-hook-tutorial-master

# Cài đặt các dependencies
RUN npm install

# Build ứng dụng React
RUN npm run build

# Cài đặt serve để phục vụ ứng dụng đã build
RUN npm install -g serve

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "3000"]
