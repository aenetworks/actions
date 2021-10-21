FROM node:14-alpine

RUN apk add --no-cache git

COPY . /action

RUN cd /action && npm ci --production
