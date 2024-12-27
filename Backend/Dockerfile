# Chỉ định image cơ sở (base image)
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY /package.json /package-lock.json /app/

# Cài đặt các dependencies cho Backend
RUN apt-get update && apt-get install -y npm
RUN cd Backend && npm install

# Sao chép toàn bộ mã nguồn vào container
COPY ./Backend /app/Backend

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 8080

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
