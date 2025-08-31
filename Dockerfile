FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
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

FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
