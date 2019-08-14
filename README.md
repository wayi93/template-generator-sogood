# SoGood & Mai&Mai<br/>eBay HTML Template Generator

## Project Enviroment

### `NodeJS` `React` `react-router-dom` `Bootstrap` `jQuery` `Popper` `MobX` `npm`

## Available Scripts (local)

In the project directory, you can run:

### `npm start`<br/>`npm test`<br/>`npm run eject`<br/>`npm run build -release`

To start server-side, you can run:

### `nohup node server/server.js`

## Available Scripts (remote)

To restart the server-side, you can run:

### `sudo stop template-generator`
### `sudo start template-generator`

To check the process running, you can run:

### `netstat -ap | grep 5000`

## About Database

We have full backup of the database everyday at 01:00 AM.<br/>
Please ask GAO to get the latest one if you need.

## Publish Project (Website)

1. Change the value of "nodejs_api_host" to "http://template.maimai24.de:5000" in the file ./src/config.js
2. Build this project from the command line using $ npm run build -release
3. Copy the folder ./server into the build folder.
4. Change the value of "api_whitelist" to "http://template.maimai24.de" in the file ./build/server/config.js
5. Change the value of "database.user", "database.password" in the file ./build/server/config.js
6. Create a new file .htaccess in the build folder and add the content to it:<br/><br/>
&nbsp;&nbsp;RewriteEngine On<br/>
&nbsp;&nbsp;RewriteBase /<br/>
&nbsp;&nbsp;RewriteRule ^index\.html$ - [L]<br/>
&nbsp;&nbsp;RewriteCond %{REQUEST_FILENAME} !-f<br/>
&nbsp;&nbsp;RewriteCond %{REQUEST_FILENAME} !-d<br/>
&nbsp;&nbsp;RewriteRule . /index.html [L]<br/><br/>
7. Upload the whole build folder to server.
