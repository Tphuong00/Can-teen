# Sử dụng Node.js v16
FROM node:18-alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies với --force
RUN npm install --omit=dev --legacy-peer-deps

# Sao chép mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Chạy ứng dụng với serve
CMD ["npm", "start"]

# Mở cổng để chạy ứng dụng
EXPOSE 80
