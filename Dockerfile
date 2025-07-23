FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:prod

EXPOSE 3000

CMD ["node", "dist/main/server.js"]
