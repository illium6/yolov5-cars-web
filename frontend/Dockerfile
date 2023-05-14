FROM node:18-alpine as build
WORKDIR /usr/src/app/frontend

COPY ./frontend .
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/frontend/dist/frontend /usr/share/nginx/html
EXPOSE 80
