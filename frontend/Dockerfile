FROM node:21-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ .
WORKDIR /etc/nginx/conf.d
COPY ./default.conf .
EXPOSE 80