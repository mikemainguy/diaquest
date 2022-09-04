# Read me 
## Getting Started
This project require firebase realtime DB and auth0 to run.  You can firebase install locally using 
[These Instructions](https://firebase.google.com/docs/emulator-suite/install_and_configure).  Alternatively,
if you have your own firebase realtime db already set up, you can configure to use your copy.
RUnning without Auth0 isn't currently supported, but I would welcome a PR to allow safely disabling it.  

## Notably, you're going to need the following things in an .env file.

AUTH0_BASE_URL:       http://localhost:3000/
AUTH0_SECRET:         bunchofrandomstuff==
FIREBASE_PRIVATE_KEY: -----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n

Once you have those configured, you should be good to go, just run npm start.

Tested Configuration:
Node 14.18.1
Npm 6.14.8

##Notes
THere's some non-sensitive firebase and auth0 stuff that you probably need to additionally config.
Would love some help on troubleshooting this and figuring out how to handle "new tenants in existing db/auth" and 
"completely new tenant for auth/firebase"...ideally corporate client and others could just fork this and config
and run a completely custom solution versus making everything "come to the mothership".

Feel free to reach out on discord at 