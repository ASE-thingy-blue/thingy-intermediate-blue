#!/bin/bash

# Action Parameters:
# restart: Restart the whole container to get rid of volatile data.
# start: Start the container. If the container already exists, delete the whole container and recreate a new one.
# detect: Find devices.

TIME="-v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro"

IP="$(ifconfig tun0 2> /dev/null | awk '/inet / {print $2}')"
PI="$(cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2)"

ACTION=""
USER=""
UUID=""
PORT="8080"
API="http://termon.pillo-srv.ch/thingy"

function print_usage_and_exit()
{
	echo "
Usage:
$0 -a detect
$0 -a start -u <USER> -i <UUID> [-p <PORT> -h <API Address>]
$0 -a restart -i <UUID>

If omitted, PORT defaults to $PORT
If omitted, API Address defaults to $API

Examples:
$0 -a detect
$0 -a start -u DKPillo -i d35a51c0de9c -p 8080 -h http://test.termon.pillo-srv.ch/thingy
$0 -a restart -i d35a51c0de9c
"
	exit 1
}

# Test if port is free
function is_port_free
{
	netstat -ntpl | grep [0-9]:${1:-8080} -q
	if [[ $? -eq 1 ]]
	then
		echo "true"
	else
		echo "false"
	fi
}

function do_container
{
    echo "Run do_container"
    docker stop ${APP}
    docker rm ${APP}
    LINKS=""
    CB="http://${IP}:${PORT}/"
    ENVVARS="--env taction=run --env tuuid=${UUID} --env tapi=${API} --env tpi=${PI} --env tcb=${CB}"
    DEVICES="--device /dev/bus/usb/001/004"
    DIRS="-v ${APP_DATA_PATH}:/var/data"
    PORTS="-p ${PORT}:8080"

    echo ""
    echo "Running Docker command:"
    echo "docker run --net host --restart=always --name ${APP} ${ENVVARS} --env \"tuser=${USER}\" ${DEVICES} ${LINKS} ${DIRS} ${TIME} ${PORTS} -d ${IMAGE}"
    echo ""
    docker run --net host --restart=always --name ${APP} ${ENVVARS} --env "tuser=${USER}" ${DEVICES} ${LINKS} ${DIRS} ${TIME} ${PORTS} -d ${IMAGE}
}

# Read arguments
while getopts ":a:u:i:p:h:" opt
do
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
		*) echo "Invalid option -$OPTARG" >&2
		print_usage_and_exit
		;;
	esac
done

# Check for empty Action argument
if [[ -z "$ACTION" ]]
then
	echo "Error: Missing Action argument"
	print_usage_and_exit
fi

# Check for empty UUID argument
if [[ -z "$UUID" ]]
then
	echo "Error: Missing UUID argument"
	print_usage_and_exit
fi

### CONFIG: set image name depending on Docker host system:
# Use pre-built Docker Image for x86_64 host systems
#IMAGE="aseteamblue/thingy-intermediate-blue"
# Use locally built Docker Image for arm host systems (see README.md)
IMAGE="thingy-intermediate-blue"

# Set Container name
APP="thingy_${UUID}"

case $ACTION in
("start")
	# Verify number of arguments passed to the script
	if [[ "$#" -lt 6 || "$#" -gt 10 ]]
	then
		echo "Illegal number of parameters"
		print_usage_and_exit
	fi

	# Check for empty User argument
	if [[ -z "$USER" ]]
	then
		echo "Error: Missing User argument"
		print_usage_and_exit
	fi

	# Verify Port argument
	re='^[0-9]+$'
	if ! [[ $PORT =~ $re ]]
	then
		echo "Error: Port argument is not a number"
		print_usage_and_exit
	fi

	APP_PATH="/opt/docker/containers/${APP}/"
	APP_DATA_PATH="${APP_PATH}data/"

	# Create directories, skip if already created
	mkdir -p ${APP_PATH}
	mkdir -p ${APP_DATA_PATH}

	# Increment port number if its already in use
	RESULT=$(is_port_free ${PORT})
	while [ "$RESULT" == "false" ]
	do
		let PORT=PORT+1
		RESULT=$(is_port_free ${PORT})
	done

	echo "Rebuilding Docker Container '${APP}'"
	do_container

;;
("restart")
    # Verify number of arguments passed to the script
	if [[ "$#" -ne 4 ]]
	then
		echo "Illegal number of parameters"
		print_usage_and_exit
	fi
	
	echo "Restarting Docker Container '${APP}'"
	docker restart ${APP}
;;
("detect")
    # Verify number of arguments passed to the script
	if [[ "$#" -ne 2 ]]
	then
		echo "Illegal number of parameters"
		print_usage_and_exit
	fi

	# Detect UUID
	docker run --net host -e "taction=detect" --device /dev/bus/usb/001/004 ${IMAGE}
;;
(*)
	echo "Invalid Action parameter"
	print_usage_and_exit
;;
esac

exit 0
