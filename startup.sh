#!/bin/bash

LOG="/var/data/intermediate.log"
echo "" > ${LOG}

cd /usr/src/app

# Print Debug Information
/usr/bin/lsusb
hciconfig

(
echo ""
echo "executing startup-script..."
echo "tuuid: ${tuuid}"
echo "tapi: ${tapi}"
echo "tpi: ${tpi}"
echo "tuser: ${tuser}"
echo "tcb: ${tcb}"
echo ""

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
) 2>&1 |tee ${LOG}
