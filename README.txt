Window$

0. install cygwin64 with default settings
1. install gem from http://rubyinstaller.org/downloads/
2. install cert for updates https://gist.github.com/fnichol/867550
   ruby "gist\win_fetch_cacerts.rb"
2. enable SeCreateSymbolicLinkPrivilege in secpol.msc\
3. install nodejs http://nodejs.org/download/
4. install vagrant https://www.vagrantup.com/downloads.html
5. install VirtualBox https://www.virtualbox.org/wiki/Downloads
gem install json_pure
vagrant plugin install vagrant-unison
vagrant plugin install vagrant-winnfsd
6. vagrant up
7. 


without vagrant
1. set current Visual Studio version/ In my case 2015
npm config set msvs_version 2015 --global


ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "npm install -g gulp"
ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "npm install -g bower"
ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && npm install"
ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && bower install"
ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && gulp"
ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && gulp serve"