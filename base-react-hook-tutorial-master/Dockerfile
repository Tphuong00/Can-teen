# Bước 1: Build ứng dụng React
FROM node:16 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Bước 2: Cấu hình Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
