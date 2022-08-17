FROM node:18

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["npx", "http-server", "build"]