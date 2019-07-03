FROM node:8-alpine

WORKDIR /

COPY . /

RUN npm i

EXPOSE 8009

CMD node app.js


