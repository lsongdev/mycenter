FROM node:12


WORKDIR /usr/src/app

COPY . .

RUN npm i --production

EXPOSE 3000

CMD [ "node", "." ]
