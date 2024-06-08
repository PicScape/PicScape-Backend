FROM node:20
# Delete the existing app folder
RUN rm -rf /app
WORKDIR /app



COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
