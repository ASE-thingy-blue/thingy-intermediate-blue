#!/bin/bash

# This script is used inside the Docker container to set up the Thingy Intermediate Gateway

DATE=`date +"%Y-%m-%d"`
TIMESTAMP=`date +"%Y-%m-%d_%H-%M"`

LOG="/var/data/intermediate.${DATE}.log"

echo "************************************************************************************************************************" >> ${LOG}
echo "*** Starting Thingy intermediate Gateway *** ${TIMESTAMP} **********************************************************" >> ${LOG}
echo "************************************************************************************************************************" >> ${LOG}

cd /usr/src/app

(
echo "USB and Bluetooth state for debug:"
/usr/bin/lsusb
hciconfig
echo "************************************************************************************************************************"
echo "Executing startup-script with params:"
echo "tuuid: ${tuuid}"
echo "tapi: ${tapi}"
echo "tpi: ${tpi}"
echo "tuser: ${tuser}"
echo "tcb: ${tcb}"
echo "************************************************************************************************************************"
echo ""

# Detect Thingy
if [ "$taction" == "detect" ]; then
    echo "Run: node . discover"
    node . discover
fi

# Run application
if [ "$taction" == "run" ]; then
    echo "Run: node . connect"
    node . connect ${tuuid} --api ${tapi} --pi ${tpi} --user "${tuser}" --cb ${tcb}
fi
) 2>&1 | tee -a ${LOG}
