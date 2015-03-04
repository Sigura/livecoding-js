vagrant up 
echo gulp serve 
ssh -f -o "StrictHostKeyChecking no" -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && gulp && gulp serve && ls" 
sleep 5s 
vagrant rsync-auto 
