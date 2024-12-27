# Chỉ định image cơ sở (base image)
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY ./Backend/package.json ./Backend/package-lock.json /app/Backend/

# Cài đặt các dependencies cho Backend
RUN cd /app/Backend && npm install

# Sao chép toàn bộ mã nguồn vào container
COPY ./Backend /app/Backend

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 8080

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
