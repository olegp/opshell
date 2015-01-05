module.exports = function() {
  if(opts.app) {
    return opts.app;
  }
  var remotes = cmd('git remote -v').split('\n');
  for(var i = 0; i < remotes.length; i ++) {
    var remote = remotes[i].split('\t'), name = remote[0];
    if(name == 'dev') {
      var url = remote[1].split(' ')[0];
      return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    }
  }
  throw new Error('APP not specified')
};