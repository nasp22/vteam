FROM node:18

WORKDIR /server

COPY package*.json ./

RUN npm install

EXPOSE 1337

CMD [ "npm", "run", "dev" ]