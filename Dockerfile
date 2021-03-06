FROM ubuntu:18.04

RUN apt-get update && apt-get install -y --no-install-recommends \
	apache2 \
	sqlite3

COPY docker-entrypoint.sh /usr/local/sbin/docker-entrypoint.sh

COPY build_site /root/build_site
COPY var_www_html /root/var_www_html
COPY usr_lib_cgi-bin /root/usr_lib_cgi-bin

RUN /root/build_site && rm -rf /root/*

RUN mkdir /var/run/apache2

RUN a2enmod cgi

RUN echo "127.0.0.1 charlesgrush.com" >> /etc/hosts

ENTRYPOINT [ "/bin/bash", "docker-entrypoint.sh" ]

EXPOSE 80 

CMD ["/usr/sbin/apache2", "-D", "FOREGROUND"]



