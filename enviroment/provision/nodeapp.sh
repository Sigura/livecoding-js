which nave || (
    curl -L https://raw.github.com/isaacs/nave/master/nave.sh > /usr/bin/nave
    chmod +x /usr/bin/nave
    chown -R vagrant:vagrant /home/vagrant/.nave
    chown -R vagrant:vagrant /home/vagrant/.npm
)
which setcap || (
    apt-get install -y setcap
)
cat << "EOF" > /etc/init/nodeapp.conf
        stop on shutdown
        respawn
        script
          su -s /bin/bash -l -c 'sudo npm config set strict-ssl false' vagrant
          su -s /bin/bash -l -c 'sudo chown -R vagrant:vagrant /home/vagrant/.npm' vagrant
          su -s /bin/bash -l -c 'cd /vagrant/nodeapp;rm -rf node_modules;npm install;./node_modules/.bin/knex migrate:latest;PORT=8080 node server.js' vagrant
        end script
        start on runlevel [2345]
EOF

