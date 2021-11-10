FROM node:14

LABEL org.opencontainers.image.source="https://github.com/aenetworks/actions"

RUN apt-get install git

COPY . /action

RUN cd /action && npm ci --production
