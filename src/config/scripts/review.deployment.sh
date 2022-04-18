#!/usr/bin/env bash

VERCEL_ORG_ID=$VERCEL_ORG_ID \
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID \
TOKEN=$VERCEL_TOKEN \
COMMIT_SHA=$CI_COMMIT_SHA \
URL=$REVIEW_URL \
VERCEL_DEPLOYMENT=$(npx --no-install vercel -e NODE_ENV=staging --meta commit=$COMMIT_SHA --no-clipboard --token=$VERCEL_TOKEN) &&
npx --no-install vercel alias $VERCEL_DEPLOYMENT $URL --token=$VERCEL_TOKEN
