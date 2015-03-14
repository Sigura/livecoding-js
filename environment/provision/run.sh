cd /home/vagrant/project/
./install.sh 
cd /home/vagrant/project/nodeapp/db/
./knex-migrate-latest.sh
cd /home/vagrant/project/
./build.sh
#gulp serve