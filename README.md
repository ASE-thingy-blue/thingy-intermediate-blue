# Node.JS Thingy Intermediate Gateway

The Thingy Intermediate Gateway forwards events and
actions between the [Nordic Thingy:52](http://www.nordicsemi.com/thingy) device and the [Thingy Web API](https://github.com/ASE-thingy-blue/thingy-api-blue).

It was derived from [https://github.com/DurandA/thingy-gateway](https://github.com/DurandA/thingy-gateway).

## Usage

When used in a production environment, this project should not be run directly. Instead the [Intermediate Gateway Docker Image](https://github.com/ASE-thingy-blue/thingy-intermediate-blue-docker) should be used to deploy the Thingy Intermediate Gateway.

For development purposes the project can still be run directly by navigating to the project directory and running

    npm install --save-dev
    node . discover
    node . connect d35a51c0de9c --api-root http://192.168.1.112:8080/thingy
