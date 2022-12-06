// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  API_ENDPOINT: 'http://localhost:8080',
  production: false,


};
// const mysql = require('mysql');

// const DB_HOST = process.env["DB_HOST"];
// const DB_USER = process.env["DB_USER"];
// const DB_PASS = process.env["DB_PASS"];
// const DB_NAME = process.env["DB_NAME"];

// const connection = mysql.createConnection({
//   host: `/cloudsql/${process.env["DB_INSTANCE"]}`,
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   socketPath: `/cloudsql/${process.env["DB_INSTANCE"]}`,
// });


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
