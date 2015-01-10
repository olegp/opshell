var app = require('../getapp')();

var command = args[0];
if(command == 'set') {
  run('etcdctl set "/apps/{0}/hosts/{1}" "{1}"', [app, args[1]]);
} else if(command == 'rm') {
  run('etcdctl rm "/apps/{0}/hosts/{1}"', [app, args[1]]);
}

run('etcdctl ls "/apps/{0}/hosts/"', [app]).split('\n').slice(0, -1).forEach(function(line) {
  //TODO show values?
  echo(line.substr(line.lastIndexOf('/') + 1));
});


