cd ../webapps
pgrep -l jabb	
node pkill --signal SIGTERM jabba
git fetch
node install
node start