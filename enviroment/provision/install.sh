#node,bower,git
which nave || (

    echo "***********************"
    echo "*    install nave     *"
    echo "*   node environment  *"
    echo "***********************"

    curl -L https://raw.github.com/isaacs/nave/master/nave.sh > /usr/bin/nave
    chmod +x /usr/bin/nave
    chown -R vagrant:vagrant /home/vagrant/.nave
    chown -R vagrant:vagrant /home/vagrant/.npm
    chown -R vagrant:vagrant /home/vagrant/project
)
echo "***********************"
echo "*   usemain 0.10.35   *"
echo "***********************"
node -v | grep 0.10.35 || nave usemain 0.10.35
sudo npm install -g npm
which gulp || npm install -g gulp
which bower || npm install -g bower
which git || sudo apt-get -y install git-core

#postgres
if [ ! -f /usr/lib/postgresql/9.3/bin/postgres ]; then
echo "************************"
echo "*install postgresql-9.3*"
echo "************************"
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
sudo -u postgres bash -l -c 'psql -l | grep timezone || createdb timezone encoding=UTF8'
sudo -u postgres bash -l -c 'psql -l | grep timezone_test || createdb timezone_test encoding=UTF8'



