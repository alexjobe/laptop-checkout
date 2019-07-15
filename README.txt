

-------------------------------------------------------------- Laptop Checkout ------------------------------------------------------------

This app is built with NodeJS, a server environment that executes server-side JavaScript, and Express, a web framework for NodeJS. The
API is defined in the /routes and /models directories. The /views directory contains index.html, which is the only html file for this
single-page app. The /public directory contains the JavaScript files that manipulate the DOM using JQuery.

-------------------------------------------------------------- How To Install -------------------------------------------------------------


Install NodeJS
	https://nodejs.org/en/download/

Run commands in root folder (you may need to update PATH to include nodejs):
	npm install
	npm start


---------------------------------------------------------------- Electron -----------------------------------------------------------------


Electron will launch the app in its own window, so there is no need to use a browser. Electron is a framework for creating native 
applications with web technologies like JavaScript, HTML, and CSS.

Electron Packager can be used to create Windows, Mac, and Linux executables. For more information, check out:
	https://www.christianengvall.se/electron-packager-tutorial/

After you create an executable with Electron Packager, you do not need to install NodeJS. The only set-up required is installing MongoDB,
either locally or on a server.

To disable Electron, open package.json and change "main" to "app.js", and "start" to "node ." Then connect to localhost:3000 in a browser.
This is required if you wish to host the app on a web server.


------------------------------------------------------ Electron Packager Instructions -----------------------------------------------------


Running this command with Electron Packager will create 32-bit and 64-bit Windows applications:

	electron-packager ../laptop-checkout laptop-checkout --platform=win32 --arch=all


---------------------------------------------------------------- Node API -----------------------------------------------------------------


The entry point for the node.js app is app.js, and routes are defined in the /routes directory. You can access the API in the browser by 
typing "/api/laptops" and "/api/checkouts". For example, to access a specific laptop, type "http://localhost:3000/api/laptops/_id", where 
_id is the ObjectId (primary key) for that laptop.