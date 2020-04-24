FROM nestjs/cli
WORKDIR /test-api
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start:dev"]