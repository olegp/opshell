FROM base

RUN apt-get install -y curl
RUN curl -qL https://github.com/kelseyhightower/confd/releases/download/v0.5.0/confd-0.5.0-linux-amd64 -o /usr/local/bin/confd && chmod +x /usr/local/bin/confd
RUN chmod +x /usr/local/bin/confd
RUN mkdir -p /etc/confd/conf.d
RUN mkdir -p /etc/confd/templates

RUN apt-get install -y nginx
RUN rm /etc/nginx/sites-available/default

ADD nginx.toml /etc/confd/conf.d/nginx.toml
ADD nginx.tmpl /etc/confd/templates/nginx.tmpl
ADD run /root/run
RUN chmod +x /root/run

EXPOSE 80
CMD /root/run