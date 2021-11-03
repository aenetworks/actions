FROM node:14-alpine

RUN apk add --no-cache git make gcc g++ python

COPY . /action

RUN cd /action && npm ci --production
