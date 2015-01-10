var unit = args[0];

//TODO reload specific app
if(unit == 'apps') {
  run("fleetctl list-units | grep app | awk '{print $1}' | { while read UNIT; do fleetctl stop $UNIT; fleetctl start $UNIT; done }", null, true);
} else if(unit) {
  run("fleetctl stop {0}; fleetctl start {0};", [unit], true);
} else {
  echo('Unit name not specified');
}

