const fetch = require('node-fetch/lib/index');

const defaultHeaders = {
  accept: 'application/json',
  'content-type': 'application/json;charset=UTF-8',
  'x-namespace': 'captain',
};

class Caprover {
  serverUrl;
  token;
  loginEndpoint;
  appsEndpoint;
  registerAppEndpoint;
  updateAppEndpoint;
  deleteAppEndpoint;
  enableSSLEndpoint;

  constructor(_serverUrl, _token) {
    this.serverUrl = _serverUrl;
    this.token = _token;
    this.loginEndpoint = this.serverUrl + '/api/v2/login';
    this.appsEndpoint = this.serverUrl + '/api/v2/user/apps/appDefinitions';
    this.registerAppEndpoint = this.serverUrl + '/api/v2/user/apps/appDefinitions/register';
    this.updateAppEndpoint = this.serverUrl + '/api/v2/user/apps/appDefinitions/update';
    this.deleteAppEndpoint = this.serverUrl + '/api/v2/user/apps/appDefinitions/delete';
    this.enableSSLEndpoint =
      this.serverUrl + '/api/v2/user/apps/appDefinitions/enablebasedomainssl';
    this.customDomainEndpoint = this.serverUrl + '/user/apps/appDefinitions/customdomain';
  }

  static async init(_serverUrl, _password) {
    const loginUrl = _serverUrl + '/api/v2/login';
    console.log(`>> loginUrl: ${_serverUrl}`);
    const res = await fetch(loginUrl, {
      headers: defaultHeaders,
      method: 'POST',
      body: JSON.stringify({ password: _password }),
    });
    const { data } = await res.json();
    return new Caprover(_serverUrl, data.token);
  }

  async apps() {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'GET',
    };
    const res = await fetch(this.appsEndpoint, options);
    const apps = await res.json();
    delete apps.data.defaultNginxConfig;
    return apps;
  }

  async appsRegister({ appName, hasPersistentData = false }) {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'POST',
      body: JSON.stringify({
        appName,
        hasPersistentData,
      }),
    };
    const res = await fetch(this.registerAppEndpoint, options);
    return res.json();
  }

  async appsEnableSSL({ appName }) {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'POST',
      body: JSON.stringify({
        appName,
      }),
    };
    const res = await fetch(this.enableSSLEndpoint, options);
    return res.json();
  }

  /**
   *
   * @param {*} body
   * @returns
   *
   * {
      appName:,
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
          key: 'LINK_DOMAIN',
          value: 'https://sniplink-preview-pr-11.mdecloud.tk',
        },
        {
          key: 'DATABASE_URL',
          value: 'mysql://user:passwd@@one-db.mdecloud.tk:6160/sniplink-dev',
        },
      ],
    }
   */
  async appsUpdate(body) {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'POST',
      body: JSON.stringify(body),
    };
    const res = await fetch(this.updateAppEndpoint, options);
    return res.json();
  }

  async appsDelete({ appName }) {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'POST',
      body: JSON.stringify({
        appName,
      }),
    };
    const res = await fetch(this.deleteAppEndpoint, options);
    return res.json();
  }

  async attachCustoDomain({ appName, domain }) {
    const options = {
      headers: { ...defaultHeaders, 'x-captain-auth': this.token },
      method: 'POST',
      body: JSON.stringify({
        appName,
        domain,
      }),
    };

    const res = await fetch(this.customDomainEndpoint, options);
    return res.json();
  }
}

module.exports = Caprover;
