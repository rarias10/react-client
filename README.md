# React Client (Redux + Router) for your server

## Dev
cp .env.example .env
# edit values if needed
npm install
npm run dev

## Docker
docker build -t react-client:latest   --build-arg VITE_API_URL=http://3.144.8.249:8080   --build-arg VITE_CSRF_PATH=/api/csrf   --build-arg VITE_REGISTER_PATH=/api/register   --build-arg VITE_LOGIN_PATH=/api/login .
docker run -d --name react-client -p 8081:80 react-client:latest
