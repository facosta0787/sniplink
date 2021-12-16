#!/usr/bin/env bash

VERCEL_ORG_ID=$VERCEL_ORG_ID \
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID \
COMMIT_SHA=$CI_COMMIT_SHA \
COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA \
ENV_NAME=$REVIEW_ENV_NAME \
VERCEL_DEPLOYMENT=$(node_modules/.bin/vercel -e NODE_ENV=staging --meta commit=$COMMIT_SHA --no-clipboard --token=$VERCEL_TOKEN) &&
node_modules/.bin/vercel alias $VERCEL_DEPLOYMENT $REVIEW_ENV_NAME-$COMMIT_SHORT_SHA.sniplink.tk --token=$VERCEL_TOKEN
