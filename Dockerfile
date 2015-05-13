#Required environment variables
#eums.environment => name corresponding with the different settings files e.g. qa, snap, staging, test

#  Base OS
FROM ubuntu:14.04
MAINTAINER eums <eums@thoughtworks.com>

##############################################################################
## install and configure supervisor
##############################################################################
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y openssh-server supervisor wget curl build-essential postgresql postgresql-contrib libpq-dev nodejs
RUN mkdir -p /var/lock/apache2 /var/run/apache2 /var/run/sshd /var/log/supervisor
COPY scripts/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN echo "root:password" | chpasswd  # need a password for ssh
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

RUN apt-get install git -y

##############################################################################
## install MongoDB
##############################################################################
ENV MONGO_VERSION 2.6.5
apt-get install -y mongodb-org=$MONGO_VERSION mongodb-org-server=$MONGO_VERSION mongodb-org-shell=$MONGO_VERSION mongodb-org-mongos=$MONGO_VERSION mongodb-org-tools=$MONGO_VERSION

##############################################################################
## install NodeJS
##############################################################################
# verify gpg and sha256: http://nodejs.org/dist/v0.10.30/SHASUMS256.txt.asc
# gpg: aka "Timothy J Fontaine (Work) <tj.fontaine@joyent.com>"
# gpg: aka "Julien Gilli <jgilli@fastmail.fm>"
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D

ENV NODE_VERSION 0.10.21
ENV NPM_VERSION 1.3.11

RUN curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
    && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
    && gpg --verify SHASUMS256.txt.asc \
    && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
    && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
    && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
	&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
	&& npm install -g npm@1.4.28 \
	&& npm install -g npm@"$NPM_VERSION" \
	&& npm install -g grunt-cli@0.1.13 \
	&& npm cache clear

##############################################################################
## install Contacts codebase
##############################################################################
ADD . /opt/app/contacts
ADD scripts/startContacts.sh /opt/scripts/startContacts.sh
ADD scripts/initContacts.sh /opt/scripts/initContacts.sh
RUN chmod a+x /opt/scripts/*.sh
RUN /opt/scripts/initContacts.sh
CMD ["/usr/bin/supervisord"]

