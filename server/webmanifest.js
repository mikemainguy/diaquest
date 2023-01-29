const env = require("./env");
const generateManifest = function (req, res)  {
    res.send(
        `
        {
  "name": "Immersive Idea",
  "display": "standalone",
  "start_url": "${env.AUTH0_BASE_URL}",
  "scope": "${env.AUTH0_BASE_URL}",
  "short_name": "Immersive Idea",
  "theme_color": "#000000",
  "background_color": "#000000",
  "description": "A diagramming tool to help collaborate and edit 3d diagrams in an immersive environment.",
  "icons": [
    {
      "src": "/assets/android-icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/assets/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": [
    "utilities",
    "business",
    "education",
    "productivity"
  ],
  "screenshots": [
    {
      "src": "/assets/com.oculus.browser-20230121-110512.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Example 1"
    },
    {
      "src": "/assets/com.oculus.browser-20230121-110746.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Example 2"
    },
    {
      "src": "/assets/com.oculus.browser-20230121-111323.jpg",
      "sizes": "1024x1024",
      "type": "image/jpeg",
      "label": "Complex Architecture Diagram"
    }
  ]
}
        `
    );
}
module.exports = {generateManifest: generateManifest};