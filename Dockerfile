FROM node:lts-alpine as builder

LABEL version="0.1.0"
LABEL description="Demo for fastify news API"
LABEL maintainer="Adriano Shimonoe <adriano.shimonoe@gmail.com>"

# update packages, to reduce risk of vulnerabilities
RUN apk update && apk upgrade
# Install openssl for cert generation
RUN apk add openssl
# Install make for package build
RUN apk add make
# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
# Install sqlite3
RUN apk add --update --no-cache sqlite && ln -sf sqlite /usr/bin/sqlite3

# set a non privileged user to use when running this image
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs
# set right (secure) folder permissions
RUN mkdir -p /home/nodejs/app/backend/node_modules
RUN mkdir -p /home/nodejs/app/backend/certs
RUN chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app/backend

# Generate certs for JWT and Server HTTPS
RUN openssl req -nodes -new -x509 -keyout ./certs/server.key -out ./certs/server.cert -subj "/C=BR/ST=SP/L=Sao-Paulo"
RUN openssl genrsa -out ./certs/jwt.pem 2048 && openssl rsa -in ./certs/jwt.pem -outform PEM -pubout -out ./certs/jwt.pub

# set default node env
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=production

ENV NPM_CONFIG_LOGLEVEL=warn

# copy project definition/dependencies files, for better reuse of layers
COPY package*.json ./

# install dependencies here, for better reuse of layers
#RUN npm install && npm audit fix && npm cache clean --force
RUN npm i

# copy all sources in the container (exclusions in .dockerignore file)
COPY --chown=nodejs:nodejs . .

EXPOSE 8000

# ENTRYPOINT
CMD [ "node", "./run" ]
