function list(type) {
  return run("fleetctl list-{0} | awk '{print $1}'", [type]).split('\n').slice(1, -1);
}

var units = list('units');
units.forEach(function(unit) {
  run('fleetctl stop {0}', [unit], true);
});

do {
  system.sleep(1000);
} while(list('units').length);

list('unit-files').forEach(function(file) {
  run('fleetctl destroy {0}', [file], true);
});

put(resolve('../../units/'), '/tmp/units/');
run('fleetctl submit /tmp/units/*', null, true);

if(!units.length) {
  units = ['nginx', 'mongodb'];
}

//TODO ensure that app units are started last
units.reverse().forEach(function(unit) {
  run('fleetctl start {0}', [unit], true);
});

