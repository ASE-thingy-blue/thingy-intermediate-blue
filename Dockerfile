FROM node:8.7

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

COPY . .
RUN npm install
RUN ["chmod", "+x", "/usr/src/app/startup.sh"]

EXPOSE 8080

# Drop privileges according to Docker and Node.js Best Practices (https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
USER node

CMD ["bash", "/usr/src/app/startup.sh"]
