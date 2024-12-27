# Sử dụng image chính thức Node.js
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json /app/

# Cài đặt các dependencies
RUN cd Backend && npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . /app

# Mở cổng cho ứng dụng
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
