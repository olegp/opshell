// http://www.thegeekstuff.com/2009/09/multitail-to-view-tail-f-output-of-multiple-log-files-in-one-terminal/
// https://devcenter.heroku.com/articles/logging
run('fleetctl journal {0}', args, true);