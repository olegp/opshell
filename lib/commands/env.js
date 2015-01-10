// https://devcenter.heroku.com/articles/config-vars
//TODO support:
// opshell config add .env
// opshell config add TEST 1234
// opshell config remove TEST

var app = require('../getapp')();
//run('etcdctl set "/apps/{0}/env/{1}" "{2}"', [app, args[0], args[1]]);

var command = args[0];
if(command == 'set') {
  run('etcdctl set "/apps/{0}/env/{1}" "{2}"', [app, args[1], args[2]]);
} else if(command == 'rm') {
  run('etcdctl rm "/apps/{0}/env/{1}"', [app, args[1]]);
}

run('etcdctl ls "/apps/{0}/env/"', [app]).split('\n').slice(0, -1).forEach(function(line) {
  echo(line.substr(line.lastIndexOf('/') + 1));
});
