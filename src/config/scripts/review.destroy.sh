#!/usr/bin/env bash

TOKEN=$VERCEL_TOKEN
REVIEW_URL=$VERCEL_REVIEW_URL

VERCEL_DEPLOYMENT_ID=$(curl "https://api.vercel.com/v2/now/aliases/$REVIEW_URL" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
| config/scripts/bin/jq-linux ".deploymentId" \ # Using jq  for taking the deploymentId value
| sed 's/"//g') # Removing double quotes

if [ -z ${VERCEL_DEPLOYMENT_ID+x} ] || [ -z ${VERCEL_DEPLOYMENT_ID} ]; then
  echo "Deployment not found"
  exit 1
else
  echo "Removing deployment '$VERCEL_DEPLOYMENT_ID'"
  curl -X DELETE "https://api.vercel.com/v11/now/deployments/$VERCEL_DEPLOYMENT_ID" -H "Authorization: Bearer $TOKEN"
  exit 0
fi
