FROM node:20-alpine

WORKDIR /usr/elo

COPY . .

RUN npm install && npm run build

EXPOSE 8080

CMD ["npm", "start"]
