FROM node:14.16.0-alpine3.13 as build-stage
RUN apk --no-cache add yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && yarn global add @quasar/cli
WORKDIR /web