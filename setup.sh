#!/bin/bash

npm i
rm -rf prisma/migrations
rm -rf prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed --preview-feature