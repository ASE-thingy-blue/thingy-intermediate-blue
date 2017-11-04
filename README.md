# Node.JS Thingy Intermediate Gateway

The Thingy Intermediate Gateway forwards events and
actions between the [Nordic Thingy:52](http://www.nordicsemi.com/thingy) device and the [Thingy Web API](https://github.com/ASE-thingy-blue/thingy-api-blue).

It was derived from [https://github.com/DurandA/thingy-gateway](https://github.com/DurandA/thingy-gateway).

## Usage

When used in a production environment, this project should not be run directly. Instead the [Intermediate Gateway Docker Image](https://github.com/ASE-thingy-blue/thingy-intermediate-blue) should be used to deploy the Thingy Intermediate Gateway.

The Docker Container is controlled with Bash Script start-container.sh
     
    ./start-container.sh -a action -u user -i uuid [-p port -h api]
    ./start-container.sh -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://termon.pillo-srv.ch/thingy

For development purposes the project can still be run directly by navigating to the project directory and running

    npm install --save-dev
    node . discover
    node . connect uuid --api serverApi --pi piSerial --user username --cb reverseApi
