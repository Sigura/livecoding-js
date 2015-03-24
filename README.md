# toptal interview project

Write a simple expenses tracker web application

## features
* The user must be able to create an account and log in.
* When logged in, user can see, edit and delete expenses he entered.
* When entered, each expense has: date, time, description, amount, comment
* User can filter expenses.
* User can print expenses per week with total amount and average day spending.
* Minimal UI/UX design is needed.
* I need every client operation done using JavaScript, reloading the page is not an option.
* REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Parse.com, Firebase.com or similar services to create the API).
* You need to be able to pass credentials to both the webpage and the API.
* In any case you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly.

_NOTE: Please keep in mind that this is the project that will be used to evaluate your skills. The project will be evaluated as if you are delivering it to a customer. We expect you to make sure that the app is fully functional and doesn’t have any obvious missing pieces. The deadline for the project is 2 weeks from today._

## configs

### server port
process.env.port or in server.js

### db
project\nodeapp\knexfile.js
> cd project
> npm run db

## setup
NODE_ENV to development or production

> cd project
> gulp

then
> forever nodeapp/server.js

or
> npm start

## dev
environment watch environment\Vagrantfile
buld system gulp watch project\gulpfile.js

for setup dev environment just
> cd environment
> .\environment\vagrant up

then ssh to localhost:2222 (vagrant@vagrant) and run
> gulp serve
or
> npm start
or
> npm test
and etc.

you can change or import private key after vagrant up there:
> environment\.vagrant\machines\default\virtualbox\

## web app
by default:
> http://localhost:3000/

ui test accessed in gulp serve:
> http://localhost:3000/test/

## install
> cd project
> npm run install

### Window$ Dev

1. install [cygwin64](https://cygwin.com/setup-x86.exe) with rsync
(for work with vagrant move to step 7.)
1. set current Visual Studio version/ In my case 2015
   npm config set msvs_version 2015 --global
1. enable SeCreateSymbolicLinkPrivilege in secpol.msc
1. install [gem](http://rubyinstaller.org/downloads/)
1. install cert for [updates](https://gist.github.com/fnichol/867550)
   ruby "gist\win_fetch_cacerts.rb"
1. install [nodejs](http://nodejs.org/download/)
(with vagrant)
1. install [vagrant](https://www.vagrantup.com/downloads.html)
1. install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. cd environment && vagrant up
1. vagrant rsync-auto

### *nix Dev

1. install rsync (sudo apt-get install rsync)
1. install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. install from site [vagrant](https://www.vagrantup.com/downloads.html)
1. cd environment && vagrant up
1. then vagrant ssh
1. cd project
1. for dev: gulp serve
1. for test: npm start
1. for production: forever nodeapp/server.js or npm start

### Deploy

1. Server Ubuntu 14.04.2 64
1. install nodejs 0.10.35
1. install npm 2.7.4
1. git apt-get -y install git-core
1. npm install -g gulp
1. npm install -g knex
1. npm install -g forever
1. npm install -g bower
1. postgresql-9.3
1. npm run installAll
1. project/nodeapp/knex-migrate-latest.sh
1. gulp
1. npm strat or forever nodeapp/server.js