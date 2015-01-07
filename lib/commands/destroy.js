//TODO confirmation?
var app = require('../getapp')();
try {
  run('rm -r ~/{0}.git', [app]);
} catch(e) {
  return echo("App doesn't exist");
}
opshell('scale', 0);
run('sudo rm -r /data/apps/{0}', [app]);
run('etcdctl rm /apps/{0} --recursive', [app]);