set -e

source /home/ubuntu/.nvm/nvm.sh
rm -rf /home/ubuntu/projects/rummy-round-game-backend
mkdir -p /home/ubuntu/projects
cd /home/ubuntu/projects
git clone -b $1 git@gitlab.com:rummy-round/rummy-round-game-backend.git --depth 1
cd /home/ubuntu/projects/rummy-round-game-backend
echo "Running npm install"
npm install

if [ $1 == 'prod' ]
then
  pm2 kill
else 
  pm2 delete rummy-round-game-backend
fi

pm2 status
NODE_ENV=$1 HOST=$2 pm2 start index.js -n rummy-round-game-backend
# curl -X POST --data-urlencode "payload={\"channel\": \"#builds\",\"text\": \"The build is successfull in ${1} with ${2}\"}" https://hooks.slack.com/services/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