var app = require('../getapp')();
try {
  run('mkdir ~/{0}.git', [app]);
} catch(e) {
  return echo("App already exists");
}
run('sudo mkdir -p /data/apps/{0}', [app]);
run('sudo chmod 777 /data/apps/{0}', [app]);
put(resolve('./app/index.js'), '/data/apps/{0}/index.js', true, [app]);
run('git init --bare /home/core/{0}.git', [app]);
put(resolve("./app/post-receive"), '/home/core/{0}.git/hooks/post-receive', true, [app]);
run('chmod +x /home/core/{0}.git/hooks/post-receive', [app]);

run('etcdctl mkdir /apps/{0}/env', [app]);
run('etcdctl mkdir /apps/{0}/hosts', [app]);
run('etcdctl mkdir /apps/{0}/units', [app]);
run('etcdctl set "/apps/{0}/hosts/{1}" "{1}"', [app, app + '.*']);

// TODO git remote add?
// git remote add opshell ssh://core-01/~/app.git

opshell('scale', 1); //TODO is this needed?
