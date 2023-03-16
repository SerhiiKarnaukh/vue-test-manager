FROM node:19.7.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install

COPY . /app

EXPOSE 5173

CMD npm run dev
