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

// TODO make this optional?
var p = subprocess.createProcess({
  command: 'ssh -F /home/oleg/.ssh/config core-01'
});

var tempFiles = [];

function exit() {
  tempFiles.forEach(function(file) {
    run('rm -rf "{0}"', [file]);
  });
  //run('exit');
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
  p.stdin.write(command + '\necho "OPSHELL:DONE" $?\n');
  var line, lines = [];
  while(true) {
    line = p.stdout.readLine();
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

var proto = require('module').prototype;
var _require = proto.require;
var paths = [fs.directory(module.filename) + '/'];
proto.require = function(name) {
  paths.push(name);
  var exports = _require.call(this, name);
  paths.pop();
  return exports;
};

global.resolve = function(filename) {
  return fs.resolve(fs.resolve.apply(fs, paths), filename);
}

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
      put(src + '/' + file, dest + '/' + file, opts);
    });
  } else {
    var content = fs.read(src);
    if(opts) {
      content = fill(content, opts);
    }
    //content.replace(/\$/g, '\\$').replace(/\\/g, '\\\\');
    run(['cat << "EOF" > "' + dest + '"', content,  'EOF'].join('\n'));
    run('touch "{0}" -d "{1}"', [dest, fs.lastModified(src).toUTCString()]);
  }
  if(!permanent) {
    tempFiles.push(dest);
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
  require('./commands/' + process.argv[2]);
} catch(e) {
  console.error(e.stack);
} finally {
  exit();
}




