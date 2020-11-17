FROM node:12


WORKDIR /usr/src/app
COPY . .

RUN npm i
RUN npm install pm2 -g
#RUN pm2 start app.js



EXPOSE 8080

#CMD ["pm2", "start",  "ecosystem.config.js"]