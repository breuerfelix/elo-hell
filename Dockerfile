FROM node:10-alpine

WORKDIR /usr/elo

COPY . .

RUN npm install && npm run build

EXPOSE 80

CMD ["npm", "start"]
