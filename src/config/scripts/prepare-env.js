const fetch = require('node-fetch/lib/index');

const SERVER_URL = process.env.CAPROVER_URL;
const SERVER_NAME = process.env.CAPROVER_SERVER;
const SERVER_KEY = process.env.CAPROVER_KEY;

async function main() {
  try {
    const loginEndPoint = SERVER_URL + '/api/v2/login';
    const registerAppEndPoint =
      SERVER_URL + '/api/v2/user/apps/appDefinitions/register';

    const resLogin = await fetch(loginEndPoint, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-namespace': 'captain',
      },
      method: 'POST',
      body: JSON.stringify({ password: SERVER_KEY }),
    });

    const { data } = await resLogin.json();

    const resRegister = await fetch(registerAppEndPoint, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-namespace': 'captain',
        'x-captain-auth': data.token,
      },
      method: 'POST',
      body: JSON.stringify({
        appName: 'test',
        hasPersistentData: false,
      }),
    });

    const register = await resRegister.json();

    console.log(`✨ ${register?.description}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
