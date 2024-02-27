FROM --platform=linux/amd64 node:20.0.0-alpine3.17

WORKDIR /app/

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]