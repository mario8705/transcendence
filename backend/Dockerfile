FROM node:18

WORKDIR /app

ARG JWT_SECRET

RUN npm i -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .

COPY node_modules node_modules

RUN pnpm i --frozen-lockfile --prod

COPY dist/ .

EXPOSE 3000

CMD [ "node", "main.js" ]
