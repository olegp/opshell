FROM base

RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
VOLUME ["/data/app"]
WORKDIR /data/app
CMD node .