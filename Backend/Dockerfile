# Chỉ định image cơ sở (base image) mà bạn muốn sử dụng
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json /app/

# Cài đặt các dependencies (bao gồm cả devDependencies cho môi trường phát triển)
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . /app

# Cài đặt babel và nodemon toàn cục nếu chưa có (nếu cần thiết)
RUN npm install -g nodemon @babel/node

# Mở cổng mà ứng dụng sẽ chạy (8080 cho backend)
EXPOSE 8080

# Lệnh để chạy ứng dụng sử dụng babel-node và nodemon
CMD ["nodemon", "--exec", "babel-node", "src/server.js"]
