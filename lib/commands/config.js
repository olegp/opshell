// https://devcenter.heroku.com/articles/config-vars
var app = require('../getapp')();
echo('etcdctl set "/apps/{0}/env/{1}" "{2}"', [app, args[0], args[1]]);