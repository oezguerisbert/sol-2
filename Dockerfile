FROM node:15.14.0

RUN npm install -g npm

COPY . .

RUN npm i
RUN rm -rf prisma/migrations
RUN rm -rf prisma/dev.db
RUN npx prisma migrate dev --name init
RUN npx prisma db seed --preview-feature

RUN npm run build

CMD [ "npm","run", "start" ]

EXPOSE 3000