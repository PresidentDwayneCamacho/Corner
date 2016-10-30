cd webapps/Corner
pgrep -l jabba	
node pkill jabba
git fetch
git checkout circle
node install
nohup npm start &