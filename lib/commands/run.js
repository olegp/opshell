var ALIASES = {
  list: 'fleetctl list-units'
};
var command = args.join(' ');
run(ALIASES[command] || command, null, true)