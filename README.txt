configs:
 server port process.env.port or in server.js
 db project\nodeapp\knexfile.js
 setup NODE_ENV to development or production
 
 
 dev-enviroment Vagrantfile
 dev-buld gulpfile.js
 

install Window$

0. install cygwin64 with default settings
1. install gem from http://rubyinstaller.org/downloads/
2. install cert for updates https://gist.github.com/fnichol/867550
   ruby "gist\win_fetch_cacerts.rb"
3. install nodejs http://nodejs.org/download/
4. install vagrant https://www.vagrantup.com/downloads.html
5. install VirtualBox https://www.virtualbox.org/wiki/Downloads


without vagrant
1. set current Visual Studio version/ In my case 2015
npm config set msvs_version 2015 --global
2. enable SeCreateSymbolicLinkPrivilege in secpol.msc

