FROM node:lts-alpine

USER node

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN npm i

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "start"]