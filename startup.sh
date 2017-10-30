#!/bin/bash

cd /usr/src/app

# Print Debug Information
/usr/bin/lsusb
hciconfig

echo "executing startup-script..."

# detect thingy
if [ "$taction" == "detect" ]; then
    echo "run: node . discover"
    node . discover
fi

# run application
if [ "$taction" == "run" ]; then
    echo "run: node . connect"
    node . connect ${tuuid} --api ${tapi} --pi ${tpi} --user ${tuser} --cb ${tcb}
fi
