#!/usr/bin/env bash

VERCEL_ORG_ID=$VERCEL_ORG_ID \
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID \
VERCEL_DEPLOYMENT=$(npx vercel -e NODE_ENV=staging --meta commit=$CI_COMMIT_SHA --no-clipboard --token=$VERCEL_TOKEN) &&
npx vercel alias $VERCEL_DEPLOYMENT stage.sniplink.tk --token=$VERCEL_TOKEN
