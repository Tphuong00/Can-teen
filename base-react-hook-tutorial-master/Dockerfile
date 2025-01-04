# Bước 1: Xây dựng ứng dụng React
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Bước 2: Chạy Nginx trên một cổng khác
FROM nginx:1.23-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

RUN echo "Nginx configured to listen on port 3000"

# Thay đổi cổng
EXPOSE 3000

# Cấu hình để Nginx nghe trên cổng 3000
RUN sed -i 's/listen 80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
