FROM node:10-alpine as ratel-vue-build
WORKDIR /usr/src/app
COPY ["package.json", ".npmrc", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm --registry https://registry.npm.taobao.org install
RUN npm install
COPY . .
ARG IMAGE_TAG=0.0.0
RUN npm run build && echo "$IMAGE_TAG" > ./build/version.txt
FROM nginx:1.15-alpine
COPY --from=ratel-vue-build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]