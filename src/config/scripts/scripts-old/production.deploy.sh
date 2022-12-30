#!/usr/bin/env bash

VERCEL_ORG_ID=$VERCEL_ORG_ID \
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID \
npx --no-install vercel --prod -e NODE_ENV=production --meta commit=$CI_COMMIT_SHA --no-clipboard --token=$VERCEL_TOKEN
