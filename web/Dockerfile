FROM node:14.16.0-alpine3.13 as build-stage
RUN apk --no-cache add yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && yarn global add @quasar/cli
WORKDIR /web
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 80
CMD [ "quasar", "dev", "-p", "80"] 
# RUN quasar build

# production stage
# this configures a nginx webserver and copies the files from the build to the webserver
# FROM nginx:stable-alpine as production-stage
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /web/dist/spa /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]