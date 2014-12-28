FROM base

RUN apt-get install -y mongodb
VOLUME ["/data/db", "/data/backups"]
WORKDIR /data
EXPOSE 27017
CMD ["mongod"]
