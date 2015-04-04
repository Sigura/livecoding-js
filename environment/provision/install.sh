#node,bower,git
which wget || apt-get -y install wget
# apt-get -y install build-essential g++
which nave || (

    echo " "
    echo "***********************"
    echo "*    install nave     *"
    echo "*   node environment  *"
    echo "***********************"
    echo " "

    curl -L https://raw.github.com/isaacs/nave/master/nave.sh > /usr/bin/nave
    chmod +x /usr/bin/nave
    chown -R vagrant:vagrant /home/vagrant/.nave
    chown -R vagrant:vagrant /home/vagrant/.npm
    chown -R vagrant:vagrant /home/vagrant/project
)
echo " "
echo "***********************"
echo "*   usemain 0.10.35   *"
echo "***********************"
echo " "
node -v | grep 0.10.35 || nave usemain 0.10.35
which node || apt-add-repository ppa:chris-lea/node.js
which node || apt-add update
which node || apt-get -y install nodejs
which node || sudo apt-get -y install nodejs-legacy
which npm || apt-get -y install npm
# npm -g install npm@next
which git || apt-get -y install git-core
which gulp || npm install -g gulp
which bower || npm install -g bower
which knex || npm install -g knex
which forever || npm install -g forever
which babel || npm install -g babel
which react-tools || npm install -g react-tools

#postgres
if [ ! -f /usr/lib/postgresql/9.3/bin/postgres ]; then
echo  ""
echo "************************"
echo "*install postgresql-9.3*"
echo "************************"
echo " "
apt-get update
apt-get -y install \
    postgresql-9.3 \
    postgresql-contrib-9.3 \
    libpq-dev

cat <<- EOF > /etc/postgresql/9.3/main/pg_hba.conf
local   all             all                                trust
host    all             all             127.0.0.1/32       trust
host    all             all             ::1/128            trust
EOF
chown postgres:postgres /etc/postgresql/9.3/main/pg_hba.conf
service postgresql restart
fi

sudo -u postgres createuser vagrant -s || echo 'user exists'
sudo -u postgres bash -l -c 'psql -l | grep expenses || createdb expenses encoding=UTF8'
sudo -u postgres bash -l -c 'psql -l | grep expenses_test || createdb expenses_test encoding=UTF8'

chmod +x /home/vagrant/project/nodeapp/knex-migrate-latest.sh
chmod +x /home/vagrant/project/build.sh
chmod +x /home/vagrant/project/install.sh