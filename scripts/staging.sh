#!/bin/bash
KEY_LOCATION=$1
USER=$2
ADDRESS=$3

echo "ssh into staging"
ssh -t -t -i ${KEY_LOCATION} ${USER}@${ADDRESS} << EOF

echo "change to root user"
sudo su

echo "Go to home"
cd /var/www

echo "remove previous code"
rm -rf contact-provisioning
source /etc/profile

echo "remove chef directory"
rm -rf /var/www/contacts-staging/provisioning

echo "create chef directory"
mkdir -p /var/www/contacts-staging/provisioning

echo "clone the provisoning repository"
git clone https://github.com/unicefuganda/contact-provisioning.git /var/www/contacts-staging/provisioning

echo "add cookbook and roles path to solo.rb"
rm /etc/chef/solo.rb

echo 'cookbook_path "/var/www/contacts-staging/provisioning/chef/cookbooks"' >> /etc/chef/solo.rb

echo 'role_path "/var/www/contacts-staging/provisioning/chef/roles"' >> /etc/chef/solo.rb

echo "provision contacts to staging"
chef-solo -o role[all]

echo "restart nginx"
killall -9 nginx
service nginx restart
exit
exit
EOF
