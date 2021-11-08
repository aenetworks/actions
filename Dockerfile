FROM node:14

RUN apt-get install git

COPY . /action

RUN cd /action && npm ci --production
