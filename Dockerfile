FROM ppdeassis/node-nginx-alpine:0.3.0
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm --registry https://registry.npm.taobao.org install
COPY . .
RUN npm run build
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
RUN cp -r build/* /usr/share/nginx/html \
    && rm -rf /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
