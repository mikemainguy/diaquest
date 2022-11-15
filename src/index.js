require('aframe');
require('aframe-extras');
require('nunjucks');
require('aframe-template-component');

import * as SignalWire from '@signalwire/js';

import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';
const analytics = Analytics(
    { app: 'immersive-idea',
        plugins: [
            googleTagManager({
                containerId: 'GTM-KDQLZ6M'
            })
        ]}
);
analytics.page();


function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../client/jslibs/', true, /\.js$/));
requireAll(require.context('../client/components/', true, /\.js$/));
requireAll(require.context('../client/firebase/', true, /\.js$/));

