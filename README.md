# Node.JS Thingy Intermediate Gateway

The Thingy Intermediate Gateway forwards events and
actions between the [Nordic Thingy:52](http://www.nordicsemi.com/thingy) device and the [Thingy Web API](https://github.com/ASE-thingy-blue/thingy-api-blue).

It was derived from [https://github.com/DurandA/thingy-gateway](https://github.com/DurandA/thingy-gateway).

## Usage

The Docker Container is controlled with Bash Script start-container.sh

    start-container.sh -a <ACTION> -u <USER> -i <UUID> [-p <PORT> -h <API Address>]

Example:

    start-container.sh -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://termon.pillo-srv.ch/thingy

For development purposes the project can still be run directly by navigating to the project directory and running

    npm install --save-dev
    node . discover
    node . connect <UUID> --api <serverApi> --pi <piSerial> --user <username> --cb <reverseApi>
