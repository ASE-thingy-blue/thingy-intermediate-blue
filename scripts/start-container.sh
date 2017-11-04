#!/bin/bash

#
# Ussage:
# ./start-container.sh -a action -u user -i uuid [-p port -h api]
# ./start-container.sh -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://test.termon.pillo-srv.ch/thingy
#
# Parameter:
# -a action [restart|start|detect]
#
# Actions:
# restart [Container neu starten]
# start[Container löschen und neu erstellen]
#

TIME="-v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro"

IP="`ifconfig tun0 2>/dev/null|awk '/inet / {print $2}'`"
PI="`cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2`"

# Argumente müssen mitgegeben werden
if [ "$#" -eq 0 ]; then
    echo "Illegal number of parameters"
    echo ""
    echo "Ussage: $0 -a action -u user -i uuid [-p port -h api]"
    echo "Ussage: $0 -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://test.termon.pillo-srv.ch/thingy"
    echo ""
    exit 0
fi

ACTION=""
USER=""
UUID=""
PORT="22"
API="http://termon.pillo-srv.ch/thingy"

# Test if Port is free
function is_port_free {
    netstat -ntpl | grep [0-9]:${1:-8080} -q ;
    if [ $? -eq 1 ]; then
        echo true
    else
        echo false
    fi
}

# Increment Port number if its already in use
RESULT="`is_port_free ${PORT}`"
while [ "$RESULT" == "false" ]; do
    let PORT=PORT+1
    RESULT="`is_port_free ${PORT}`"
done

# Argumente auslesendd
while getopts ":a:u:i:p:h:" opt; do
  case $opt in
    a) ACTION="$OPTARG"
    ;;
    u) USER="$OPTARG"
    ;;
    i) UUID="$OPTARG"
    ;;
    p) PORT="$OPTARG"
    ;;
    h) API="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    echo ""
    echo "Ussage: $0 -a action -u user -i uuid [-p port -h api]"
    echo "Ussage: $0 -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://test.termon.pillo-srv.ch/thingy"
    echo ""
    exit 0
    ;;
  esac
done

IMAGE="aseteamblue/thingy-intermediate-blue"
#Enable for Local Image Ussage
#IMAGE="thingy-test"

# Detect UUID
if [ "$ACTION" == "detect" ]; then
    docker run --net host -e "taction=detect" --device /dev/bus/usb/001/004 ${IMAGE}
    exit 0
fi

# App Name muss gesetzt sein
if [ "$ACTION" == "" ]; then
    echo "params missing"
    echo ""
    echo "Ussage: $0 -a action -u user -i uuid [-p port -h api]"
    echo "Ussage: $0 -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://test.termon.pillo-srv.ch/thingy"
    echo ""
    exit 0
fi

# Pfad Variabeln setzen
APP="thingy_${UUID}"

APP_PATH="/opt/docker/containers/${APP}/"
APP_DATA_PATH="${APP_PATH}data/"

# Verzeichnisse erstellen, falls diese noch nicht existieren
mkdir -p ${APP_PATH}
mkdir -p ${APP_DATA_PATH}

function do_container {
    echo "run do_container"
    docker stop ${APP}
    docker rm ${APP}
    LINKS=""
    CB="http://${IP}:${PORT}/"
    ENVVARS="-e taction=run -e tuuid=${UUID} -e tuser=${USER} -e tapi=${API} -e tpi=${PI} -e tcb=${CB}"
    DEVICES="--device /dev/bus/usb/001/004"
    DIRS="-v ${APP_DATA_PATH}:/var/data"
    PORTS="-p ${PORT}:8080"
    #echo "docker run --net host --name ${APP} ${ENVVARS} ${DEVICES} ${LINKS} ${DIRS} ${TIME} ${PORTS} -d ${IMAGE}"
    docker run --net host --name ${APP} ${ENVVARS} ${DEVICES} ${LINKS} ${DIRS} ${TIME} ${PORTS} -d ${IMAGE}
}

# Actions ausführen
if [ "$ACTION" == "restart" ]; then
    echo "Restarting Docker Container ${APP}"
    docker restart ${APP}
    exit 0
fi

if [ "$ACTION" == "start" ]; then
    echo "Rebuilding Docker Container ${APP}"
    do_container
    exit 0
fi