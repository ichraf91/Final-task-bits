FROM node:16-alpine
RUN apk update && apk add git

WORKDIR /
COPY package.json .
RUN npm install


WORKDIR /app
COPY . . 
RUN npm build
CMD ["npm", "run", "dev"]

