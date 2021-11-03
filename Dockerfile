FROM node:14-alpine

RUN apk add --no-cache git python

COPY . /action

RUN cd /action && npm ci --production
