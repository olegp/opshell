var unit = args[0];

if(unit == 'apps') {
  run("fleetctl list-units | grep app | awk '{print $1}' | { read UNIT; fleetctl stop $UNIT; fleetctl start $UNIT; }", null, true);
}

if(unit) {
  run("fleetctl stop {0}; fleetctl start {0};", [unit], true);
}

