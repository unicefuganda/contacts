#!/bin/bash
echo "ssh into staging"
ssh -t -i $HOME/.ssh/id_rsa_staging staging@196.0.26.51 << EOF
echo "change to root user"
sudo su
echo "Go to home"
cd /home
echo "remove previous code"
rm -rf contact-provisioning
source /etc/profile
echo "clone the provisoning repository"
git clone https://github.com/unicefuganda/contact-provisioning.git
echo "create chef directory"
mkdir -p /home/contacts-staging/provisioning/chef/
echo "copy cookbooks and roles to chef directory"
cp -ar contact-provisioning/chef/cookbooks /home/contacts-staging/provisioning/chef/
cp -ar contact-provisioning/chef/roles /home/contacts-staging/provisioning/chef/
echo "add cookbook and roles path to solo.rb"
rm /etc/chef/solo.rb
echo 'cookbook_path "/home/contacts-staging/provisioning/chef/cookbooks"' >> /etc/chef/solo.rb
echo 'role_path "/home/contacts-staging/provisioning/chef/roles"' >> /etc/chef/solo.rb
echo "provision contacts to staging"
chef-solo -o role[all-in-one]
exit
exit
EOF
