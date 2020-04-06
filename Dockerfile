FROM node

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package.json .
RUN npm install --save

EXPOSE 3000