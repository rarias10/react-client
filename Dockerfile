# --- Build stage -------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit

# Build app with Vite env args
COPY . .
ARG VITE_API_URL
ARG VITE_CSRF_PATH
ARG VITE_REGISTER_PATH
ARG VITE_LOGIN_PATH
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CSRF_PATH=${VITE_CSRF_PATH}
ENV VITE_REGISTER_PATH=${VITE_REGISTER_PATH}
ENV VITE_LOGIN_PATH=${VITE_LOGIN_PATH}
RUN npm run build

# --- Runtime stage (Nginx) --------------------------------------------------
FROM nginx:1.27-alpine

# Put built assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Use your custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
