var system = require('system');
var fs = require('fs-base');
var subprocess = require('subprocess');

global.args = process.argv.slice(3);
global.opts = (function () {
  var opts = {};
  for(var i = 0; i < args.length; i ++) {
    if (!args[i].indexOf('--')) {
      var key = args[i], value = args[i + 1];
      opts[key.substr(2)] = value;
      args.splice(i --, 2);
    }
  }
  return opts;
})();

global.config = (function() {
  var FILE = '.opshell';
  var home = process.env.HOME || process.env.HOMEPATH, json;
  var homeConfig = home + '/' + FILE;
 if(fs.exists(FILE)) {
   //TODO search for .opshell file in all parent dirs
   json = fs.read(FILE);
 } else if(fs.exists(homeConfig)) {
    json = fs.read(homeConfig);
 } else {
    //TODO support plink on Windows?
    system.stdout.write('CoreOS host: ');
    var host = system.stdin.readLine().trim();
    var config = {
      host: host,
      //TODO fix keychecking
      ssh: "ssh -o StrictHostKeyChecking=no core@" + host
    };
    process.stdout.write('Make this global? [Y/n] ');
    var line = system.stdin.readLine().trim();
    var isGlobal = !(line == 'n' || line == 'N');
    fs.write(isGlobal ? homeConfig : FILE, JSON.stringify(config) + '\n');
    return config;
  }
  return JSON.parse(json);
})();


// TODO clean error reporting when this fails
var ssh = subprocess.createProcess({
  command: config.ssh
});

var tmp = [];

function exit() {
  tmp.forEach(function(file) {
    run('rm -rf "{0}"', [file]);
  });
  system.exit();
}

global.fill = function(string, args) {
  if(!string) return;
  for(var key in args) {
    string = string.replace(new RegExp('\\{' + key + '\\}','g'), args[key]);
  }
  return string;
};

global.run = function(command, opts, verbose) {
  if(opts) {
    command = fill(command, opts);
  }
  ssh.stdin.write(command + '\necho "OPSHELL:DONE" $?\n');
  var line, lines = [];
  while(true) {
    line = ssh.stdout.readLine();
    if(!line.indexOf("OPSHELL:DONE")) {
      var code = +line.split(' ')[1];
      if(code) throw new Error(command + ': ' + (lines.join('') || code));
      break;
    } else {
      if(verbose) {
        process.stdout.write(line);
      }
      lines.push(line);
    }
  }
  return lines.join('');
};

global.fs = fs;

var paths = [fs.directory(module.filename) + '/'];

(function() {
  var proto = require('module').prototype;
  var _require = proto.require;
  proto.require = function (name) {
    paths.push(name);
    var exports = _require.call(this, name);
    paths.pop();
    return exports;
  };
})();

global.resolve = function(filename) {
  return fs.resolve(fs.resolve.apply(fs, paths), filename);
};

global.read = function(filename) {
  return fs.read(resolve(filename));
};

global.put = function(src, dest, permanent, opts) {
  if(opts) {
    src = fill(src, opts);
    dest = fill(dest, opts);
  }
  if(fs.isDirectory(src)) {
    run('mkdir -p {0}', [dest]);
    run('touch "{0}" -d "{1}"', [dest, fs.lastModified(src).toUTCString()]);
    fs.list(src).forEach(function(file) {
      put(src + '/' + file, dest + '/' + file, permanent, opts);
    });
  } else {
    var content = fs.read(src);
    if(opts) {
      content = fill(content, opts);
    }
    run(['cat << "EOF" > "' + dest + '"', content,  'EOF'].join('\n'));
    run('touch "{0}" -d "{1}"', [dest, fs.lastModified(src).toUTCString()]);
  }
  if(!permanent) {
    tmp.push(dest);
  }
};

global.echo = function(text, opts) {
  if(opts) {
    text = fill(text, opts);
  }
  console.log(text);
};

global.cmd = function(command) {
  return subprocess.command(command);
};

global.opshell = function(command, rest) {
  var args = Array.prototype.slice.call(arguments, 1);
  var oldArgs = global.args;
  global.args = args;
  require('./commands/' + command);
  args = oldArgs;
};

try {
  run('export TERM=${TERM:-dumb}');
  var command = process.argv[2];
  if(fs.exists(resolve('./commands/' + command + '.js'))) {
    require('./commands/' + command);
  } else {
    echo(fill('Unrecognized command "{0}", try "opshell help"', [command]));
  }
} catch(e) {
  console.error(e.stack);
} finally {
  exit();
}




