FROM node:18

WORKDIR /simulation

COPY package*.json ./

RUN npm install

EXPOSE 1338

CMD ["node", "scooter-handler.js"]