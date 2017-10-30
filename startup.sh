#!/bin/bash

# detect thingy
if [ "$taction" == "detect" ]; then
    node . discover
    exit 0
fi

# run application
if [ "$taction" == "run" ]; then
    node . connect ${tuuid} --api ${tapi} --user ${tuser}
    exit 0
fi