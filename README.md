# Node.JS Thingy Intermediate Gateway

The Thingy Intermediate Gateway forwards events and
actions between the [Nordic Thingy:52](http://www.nordicsemi.com/thingy) device and the [Thingy Web API](https://github.com/ASE-thingy-blue/thingy-api-blue).

It was derived from [https://github.com/DurandA/thingy-gateway](https://github.com/DurandA/thingy-gateway).

## Usage

The Docker Image has to be built on a Raspberry Pi because of its processor architecture.

Change the image to use depending on your Docker Host architecture (see CONFIG in [start-container.sh](https://github.com/ASE-thingy-blue/thingy-intermediate-blue/blob/master/scripts/start-container.sh)):
        
    git clone git@github.com:ASE-thingy-blue/thingy-intermediate-blue.git
    cd thingy-intermediate-blue/
    docker build -t thingy-intermediate-blue .

The Docker Container is controlled with Bash Script [start-container.sh](https://github.com/ASE-thingy-blue/thingy-intermediate-blue/blob/master/scripts/start-container.sh):

    ./scripts/start-container.sh -a <ACTION> -u <USER> -i <UUID> [-p <PORT> -h <API Address>]

Examples:

    ./scripts/start-container.sh -a detect -i d35a51c0de9c
    ./scripts/start-container.sh -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://termon.pillo-srv.ch/thingy
    ./scripts/start-container.sh -a restart -i d35a51c0de9c

For development purposes the project can still be run directly by navigating to the project directory and running

    npm install --save-dev
    node . discover
    node . connect <UUID> --api <serverApi> --pi <piSerial> --user <username> --cb <reverseApi>
