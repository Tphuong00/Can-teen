# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Kiểm tra phiên bản Node.js và npm
RUN node -v
RUN npm -v

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Kiểm tra xem npm đã cài đặt thành công chưa
RUN which npm

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Kiểm tra lại cấu trúc thư mục
RUN ls -l /app

# Chuyển vào thư mục base-react-hook-tutorial-master
WORKDIR /app/base-react-hook-tutorial-master

# Kiểm tra thư mục hiện tại
RUN pwd

# Cài đặt các dependencies trong thư mục của dự án React
RUN npm install

# Build ứng dụng React
RUN npm run build

# Cài đặt serve để phục vụ ứng dụng đã build
RUN npm install -g serve

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "3000"]
