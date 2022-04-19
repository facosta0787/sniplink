#!/usr/bin/env bash

TOKEN=$VERCEL_TOKEN
URL=$REVIEW_URL

VERCEL_DEPLOYMENT_ID=$(curl -k "https://api.vercel.com/v2/now/aliases/$URL" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
| src/config/scripts/bin/jq-linux ".deploymentId" \
| sed 's/"//g')

if [ -z ${VERCEL_DEPLOYMENT_ID+x} ] || [ -z ${VERCEL_DEPLOYMENT_ID} ]; then
  echo "Deployment not found"
  exit 1
else
  echo "Removing deployment '$VERCEL_DEPLOYMENT_ID'"
  curl -k -X DELETE "https://api.vercel.com/v11/now/deployments/$VERCEL_DEPLOYMENT_ID" -H "Authorization: Bearer $TOKEN"
  exit 0
fi
