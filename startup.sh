#!/bin/bash

# This script is used inside the Docker container to set up the Thingy Intermediate Gateway

LOG="/var/data/intermediate.log"
echo "" > ${LOG}

cd /usr/src/app

# Print Debug Information
/usr/bin/lsusb
hciconfig

(
echo ""
echo "Executing startup-script..."
echo "tuuid: ${tuuid}"
echo "tapi: ${tapi}"
echo "tpi: ${tpi}"
echo "tuser: ${tuser}"
echo "tcb: ${tcb}"
echo ""

# Detect Thingy
if [ "$taction" == "detect" ]; then
    echo "Run: node . discover"
    node . discover
fi

# Run application
if [ "$taction" == "run" ]; then
    echo "Run: node . connect"
    node . connect ${tuuid} --api ${tapi} --pi ${tpi} --user ${tuser} --cb ${tcb}
fi
) 2>&1 | tee ${LOG}
