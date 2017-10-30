FROM node:8.7

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

RUN apt-get update
RUN apt-get install bluez -y
RUN apt-get clean

COPY . .
RUN npm install
RUN ["chmod", "+x", "/usr/src/app/startup.sh"]

EXPOSE 8080

# Drop privileges according to Docker and Node.js Best Practices (https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
# USER node

ENTRYPOINT ["/bin/bash", "-c", "/usr/src/app/startup.sh"]
