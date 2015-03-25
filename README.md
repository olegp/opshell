# Opshell

## Overview

Opshell is a minimal [Node.js](http://nodejs.org/) "PaaS" used for running a single web app in a cluster consisting of a load balancer, scalable web tier and [MongoDB](https://www.mongodb.org/) database using [Docker](https://docker.com/) and [CoreOS](https://coreos.com/). It can be used as is or as a starting point for your own deployment. Opshell runs on any platform supported by CoreOS, including [Vagrant](https://www.vagrantup.com) (for development), [Digital Ocean](https://www.digitalocean.com), AWS EC2 and your own hardware.

If you have 20 or so minutes, check [this video of a talk](http://developers.almamedia.fi/helsinkijs-devopsfinland-january-2015/#nodejs-paas-using-docker--coreos) introducing Opshell.

Current features include:

- `git push` based deployment
- zero downtime redeployment
- daily database backups
- fast setup and redeployment
- easy extensibility

Planned features are:

- HTTPS support
- multi machine deployments
- worker unit for long running jobs

## Getting Started

First, clone this repo with `git clone https://github.com/olegp/opshell.git` and enter the directory with `cd opshell`. Next, configure your CoreOS machine:

  * If you're [using Vagrant locally](https://www.vagrantup.com/downloads), start the VM with `vagrant up`, add the Vagrant VM SSH config to your SSH config using `vagrant ssh-config >> ~/.ssh/config` and test that it's working with `ssh core-01`.
  * On Digital Ocean follow [these instructions](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-coreos-cluster-on-digitalocean), but use the `user-data` file in the Opshell directory and omit the discovery URL step. The rest of the instructions assume your CoreOS host has the hostname `core-01` so just replace that with the hostname or IP of your droplet.

To set up your cluster, simply run `./opshell core-01`. The initial set up will take some time as the Docker images are built from scratch, but later runs will be faster as the builds are cached. Once everything is up and running, the URL at which you can access your web app will be printed out ([http://localhost:8080](http://localhost:8080) if using Vagrant).

Change to your Node webapp directory. Initialize Git with `git init && git add * && git commit -m "hello opshell"` if you haven't already, then add the Opshell cluster as a remote with `git remote add opshell ssh://core-01/~/app.git`. The database URL is provided via an environment variable, so change it to `process.env.DATABSE_URL` in your code (instead of the default `127.0.0.1:27017`) and commit the change. Finally, deploy your app via:

    git push opshell master

The first deployment will take a while as Node packages are downloaded for the first time, but later deployments will use cached packages.

## Updating the Cluster

To update your cluster, simply edit this repo and run `./opshell core-01` to rebuild your Docker images and restart the cluster. You can optionally use Git to keep track of your changes.

## License

(The MIT License)

Copyright (c) 2014+ Oleg Podsechin

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.













