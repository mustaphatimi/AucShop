FROM node:14

WORKDIR /Services/Auction/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]