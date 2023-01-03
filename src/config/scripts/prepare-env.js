const fetch = require('node-fetch/lib/index');
const Caprover = require('../../lib/caprover-api');

const SERVER_URL = process.env.CAPROVER_SERVER_URL;
const SERVER_KEY = process.env.CAPROVER_KEY;
const APP_NAME = process.env.CAPROVER_APP_NAME;
const DB_URL = process.env.CAPROVER_DB_URL;

const DEFAULT_APP_CONFIG = {
  appName: APP_NAME,
  appDeployTokenConfig: {
    enabled: true,
  },
  instanceCount: 1,
  captainDefinitionRelativeFilePath: './captain-definition',
  containerHttpPort: 3000,
  notExposeAsWebApp: false,
  forceSsl: true,
  websocketSupport: false,
  volumes: [],
  ports: [],
  description: '',
  envVars: [
    {
      key: 'ENV',
      value: 'production',
    },
    {
      key: 'LINK_DOMAIN',
      value: `https://${APP_NAME}.mdecloud.tk`,
    },
    {
      key: 'AT_APIKEY',
      value: 'keyXmzyeYAKwrkwER',
    },
    {
      key: 'AT_TABLEID',
      value: 'appDUDBL6xpIZi5a8',
    },
    {
      key: 'AT_SHEET',
      value: 'links-dev',
    },
    {
      key: 'DATABASE_URL',
      value: DB_URL,
    },
    {
      key: 'SHADOW_DATABASE_URL',
      value: DB_URL.replace(/dev/g, 'shadow'),
    },
  ],
};

async function main() {
  try {
    const caprover = await Caprover.init(SERVER_URL, SERVER_KEY);
    const {
      data: { appDefinitions },
    } = await caprover.apps();
    const app = appDefinitions.find((appDef) => appDef.appName === APP_NAME);

    if (!Boolean(app)) {
      console.log('🏗 Creating app...');
      const newApp = await caprover.appsRegister({ appName: APP_NAME });
      console.log(newApp.description);

      console.log('🔒 Enabling default subdomain SSL');
      const sslEnabled = await caprover.appsEnableSSL({ appName: APP_NAME });
      console.log(sslEnabled.description);

      if (sslEnabled.status > 102) {
        process.exit(1);
      }
    }

    if (Boolean(app) && !app.hasDefaultSubDomainSsl) {
      console.log('🔒 Enabling default subdomain SSL');
      const sslEnabled = await caprover.appsEnableSSL({ appName: APP_NAME });
      console.log(sslEnabled.description);
    }

    console.log('🛠 Setting up the app');
    const settings = await caprover.appsUpdate(DEFAULT_APP_CONFIG);
    console.log(settings.description);

    if (settings.status > 102) {
      const deleted = await caprover.appsDelete({ appName: APP_NAME });
      console.log(deleted.description);
      process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    const deleted = await caprover.appsDelete({ appName: APP_NAME });
    console.log(deleted.description);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
