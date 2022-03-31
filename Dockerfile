FROM node:14

LABEL org.opencontainers.image.source=https://github.com/aenetworks/actions

RUN groupadd --gid 121 docker \
  && useradd --uid 1001 --gid docker --shell /bin/bash runner

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 jq \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && npm i -g standard-version@9.3.2

COPY . /action

RUN cd /action && npm ci --production

USER runner
