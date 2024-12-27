# Chỉ định image cơ sở (base image)
FROM node:16

RUN apk add --no-cache npm

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY . /app/

# Cài đặt các dependencies cho Backend
RUN cd Backend && npm install
RUN npm --version

# Sao chép toàn bộ mã nguồn vào container
COPY ./Backend /app/Backend

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 8080

# Lệnh để chạy ứng dụng
CMD ["cd", "Backend", "&&", "npm", "start", "install"]
