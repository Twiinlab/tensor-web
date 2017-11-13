// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8080',
  firebase: {
    apiKey: 'AIzaSyC369reULNUCBbeIYpk1AXKb2aR1hME6Rs',
    authDomain: 'tensorweb-af554.firebaseapp.com',
    databaseURL: 'https://tensorweb-af554.firebaseio.com',
    projectId: 'tensorweb-af554',
    storageBucket: 'tensorweb-af554.appspot.com',
    messagingSenderId: '996649256353'
  }
};
