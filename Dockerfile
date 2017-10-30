FROM node:latest

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

# Install dependencies for accessing USB Bluetooth Dongle
RUN apt-get update
RUN apt-get install bluez libusb-1.0-0-dev libudev-dev usbutils -y
RUN apt-get clean

# Copy project files and install node modules (and rebuild)
COPY . .
RUN npm install
RUN npm rebuild
RUN ["chmod", "+x", "/usr/src/app/startup.sh"]

EXPOSE 8080

# Execute start script
ENTRYPOINT ["/bin/bash", "-c", "/usr/src/app/startup.sh"]
