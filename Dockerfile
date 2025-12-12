# Build app
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Configure nginx to run app
FROM nginx:latest
COPY --from=build /app/dist/todo-fe/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

# HealthCheck
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD curl -f http://localhost:4200// || exit 1