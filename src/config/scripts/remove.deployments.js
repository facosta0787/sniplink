#!/usr/bin/env node

const fetch = require('node-fetch');
const color = require('chalk');
const Ora = require('ora');
const capitalize = require('lodash.capitalize');

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const BASE_URL = 'https://api.vercel.com';
const ALIASES_PATH = '/v3/now/aliases';
const DEPLOYMENTS_PATH = '/v5/now/deployments';
const DEPLOYMENTS_REMOVE_PATH = '/v11/now/deployments';

const spinner = new Ora({ indent: 2 });
const headers = { Authorization: `Bearer ${VERCEL_TOKEN}` };

async function fetcher(url, options = {}) {
  const response = await fetch(url, { ...options, headers });
  return response.json();
}

async function fetchDeployments() {
  const reqUrl = `${BASE_URL}${DEPLOYMENTS_PATH}?projectId=${VERCEL_PROJECT_ID}`;
  const { deployments, error } = await fetcher(reqUrl);

  if (error) {
    throw new Error(
      `Deployments | ${capitalize(error.code)}: ${error.message}`,
    );
  }

  return Promise.resolve(
    deployments.map((deployment) => ({
      uid: deployment.uid,
      url: deployment.url,
      target: deployment.target,
    })),
  );
}

async function fetchAliases() {
  const reqUrl = `${BASE_URL}${ALIASES_PATH}?projectId=${VERCEL_PROJECT_ID}`;
  const { aliases, error } = await fetcher(reqUrl);

  if (error) {
    throw new Error(`Aliases | ${capitalize(error.code)}: ${error.message}`);
  }

  return Promise.resolve(
    aliases.map(({ alias, deploymentId }) => ({
      alias,
      deploymentId,
    })),
  );
}

async function deleteDeployment(deploymentId) {
  const reqUrl = `${BASE_URL}${DEPLOYMENTS_REMOVE_PATH}/${deploymentId}`;
  return fetcher(reqUrl, { method: 'DELETE' });
}

async function main() {
  const beginTime = Date.now();
  let endTime;
  spinner.start('Removing obsolete deployments...');
  try {
    if (!VERCEL_TOKEN) {
      throw new Error('Forbidden: Token is missing, it is required.');
    }

    const [deployments, aliases] = await Promise.all([
      fetchDeployments(),
      fetchAliases(),
    ]);
    const toRemove = deployments.filter(
      (deployment) =>
        !aliases.some((alias) => alias.deploymentId === deployment.uid),
    );

    if (!toRemove.length) {
      spinner.warn(
        `${color.yellowBright('Info')} There are not deployments to remove.`,
      );
      endTime = Date.now();
      const spendTime = (endTime - beginTime) / 1000 + 's.';
      console.log('✨ Done in ' + spendTime);
      process.exit(0);
    }

    const removePromises = toRemove.map((deployment) =>
      deleteDeployment(deployment.uid),
    );
    const responseValues = await Promise.all(removePromises);

    if (responseValues.every((value) => value.state === 'DELETED')) {
      spinner.succeed(
        `${color.greenBright('Success')} Obsolete deployments removed.`,
      );
      console.table(toRemove);
      endTime = Date.now();
      const spendTime = (endTime - beginTime) / 1000 + 'secs.';
      console.log('✨ Done in ' + spendTime);
      process.exit(0);
    }
  } catch (err) {
    spinner.fail(
      `${color.redBright('Error')} ${err.message.replace(/Error:/gi, '')}.`,
    );
    process.exit(1);
  }
}

main();
