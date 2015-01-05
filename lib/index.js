var subprocess = require('subprocess');
var fs = require('fs-base');

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

console.log(args, opts);

// TODO make this optional?
var p = subprocess.createProcess({
  command: 'ssh -F /home/oleg/.ssh/config core-01'
});

function exit() {
  run('export TERM=${TERM:-dumb}');
  run('exit');
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
  p.stdin.write(command + '; echo "\0" $?\n');
  var line, lines = [];
  while(true) {
    line = p.stdout.readLine();
    if(line.charAt(0) == 0) {
      var code = +line.substr(1);
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

var proto = require('module').prototype;
var _require = proto.require;
var paths = [fs.directory(module.filename) + '/'];
proto.require = function(name) {
  paths.push(name);
  var exports = _require.call(this, name);
  paths.pop();
  return exports;
};

global.read = function(filename) {
  return fs.read(fs.resolve(fs.resolve.apply(fs, paths), filename));
};

global.put = function(src, dest) {
  //TODO support dirs
  //TODO track temp files and rm them on exit
  run(['cat << EOF > "' + dest + '"', read(src),  'EOF'].join('\n'));
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

//global.args = process.argv.slice(3);

try {
  require('./commands/' + process.argv[2]);
} catch(e) {
  console.error(e.stack);
} finally {
  exit();
}




