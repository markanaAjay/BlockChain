set -e

eval $(ssh-agent -s)
echo "$PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null

set -e
mkdir -p ~/.ssh
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config

if [ $CI_ENVIRONMENT_NAME == 'prod' ]
then
  DEPLOY_SERVERS=${PRODUCTION_IP}
else 
  DEPLOY_SERVERS=${STAGGING_IP}
fi

ALL_SERVERS=(${DEPLOY_SERVERS//,/ })
echo "ALL_SERVERS ${ALL_SERVERS}"

echo "Starting deployment in ${CI_COMMIT_BRANCH} branch with commit ${CI_COMMIT_TITLE}"

for SERVER in "${ALL_SERVERS[@]}"
do
  echo "deploying to ${SERVER}"
  # curl -X POST --data-urlencode "payload={\"channel\": \"#builds\",\"text\": \"Starting deployment in *${CI_COMMIT_BRANCH}* branch with commit *${CI_COMMIT_TITLE}* in ${SERVER}\"}" https://hooks.slack.com/services/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
  ssh ubuntu@${SERVER} 'bash -s' < ./scripts/updateAndRestart.sh ${CI_COMMIT_BRANCH} ${SERVER}
done
