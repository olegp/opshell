var app = require('../getapp')();
var scale = +args[0];
var count = +run('fleetctl list-units | grep app@{0} | wc -l', [app]);

if(count < scale) {
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  while(count < scale) {
    var port = random(1024, 65536);
    run('fleetctl start app@{0}-{1}.service', [app, port], true);
    count ++;
  }
}

if(count > scale) {
  run("fleetctl list-units | grep -m {1} app@{0} | awk '{print $1}'", [app, count - scale]).split('\n').forEach(function(unit) {
    run('fleetctl destroy {0}', [unit], true);
  });
}
