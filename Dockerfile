FROM node:9-alpine

WORKDIR /api

RUN yarn install

EXPOSE 3000

ADD . /api

CMD ["yarn", "start"]