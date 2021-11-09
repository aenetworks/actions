FROM node:14

RUN apt-get update && apt-get install git libnss3

COPY . /action

RUN cd /action && npm ci --production
