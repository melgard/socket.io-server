FROM node:lts-alpine3.9 as builder
WORKDIR /temp
COPY tsconfig.json ./
COPY package*.json ./
RUN npm install typescript
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf /node_modules

WORKDIR /app
RUN cp -r /temp/dist/* /app
RUN cp -r /temp/package.json /app/package.json
RUN rm -rf /temp

RUN npm install --production
RUN npm install -g pm2
RUN npm install config

EXPOSE 80

CMD [ "pm2-runtime", "npm", "--", "start", "--restart-delay=3000" ]
