# Sử dụng Node.js chính thức
FROM node:16-buster

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json từ thư mục Backend
COPY Backend/package.json /app/Backend/
COPY Backend/package-lock.json /app/Backend/

# Chuyển đến thư mục Backend và cài đặt npm
WORKDIR /app/Backend
RUN npm install --unsafe-perm

# Sao chép toàn bộ mã nguồn vào container
WORKDIR /app
COPY . .

# Mở cổng cho ứng dụng
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
