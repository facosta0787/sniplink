#!/usr/bin/env bash

VERCEL_ORG_ID=$VERCEL_ORG_ID \
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID \
node_modules/.bin/vercel --prod -e NODE_ENV=production --meta commit=$CI_COMMIT_SHA --no-clipboard --token=$VERCEL_TOKEN