# cookie.Clicker

A small static browser game built with HTML, CSS, and JavaScript.

## Open in any browser

### Option 1: Open directly
1. Open `index.html` in your browser.
2. Modern browsers should load the game and run it.

### Option 2: Run a local web server
This is the best way to make the page reachable in any browser and avoid file-based restrictions.

#### Using Node.js
1. Run `node server.js` in the `cookie-clicker-site` folder.
2. Open `http://localhost:8000` in any browser.

#### Using Python
1. Run `python -m http.server 8000` in the `cookie-clicker-site` folder.
2. Open `http://localhost:8000` in any browser.

## Access from another device on the same network
1. Find your computer's local IP address.
2. Open `http://<your-ip>:8000` on another device.

## Notes
- The game uses standard web features, so it works on Chrome, Edge, Firefox, Safari, and most modern browsers.
- If audio does not play immediately, click the cookie once to unlock sound on some browsers.
- Progress is saved automatically using browser storage.
