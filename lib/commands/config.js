var app = require('../getapp')();
echo('etcdctl set /apps/{app}/env/{key} {value}', {app: app, key: args[0], value: args[1]});