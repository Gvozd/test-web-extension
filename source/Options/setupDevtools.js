import {initialize as frontendInitialize} from 'react-devtools-inline/frontend';
import {activate as backendActivate, initialize as backendInitialize} from 'react-devtools-inline/backend';
import React from "react";
import {unstable_createRoot as createRoot} from "react-dom";

// reset renderer, for `backendInitialize` not observe it, and DevTool not self-debug
Object.keys(require.cache)
    .filter(k => k.includes('react-dom'))
    .forEach(k => {
        delete require.cache[k];
    })

// order of execution is important!
//   this is recommended order
//   @see https://github.com/facebook/react/tree/master/packages/react-devtools-inline#usage
const DevTools = frontendInitialize(window);
backendInitialize(window);
backendActivate(window);

const devtoolsWindow = window.open('', '__react_devtools');
devtoolsWindow.document.title = 'React Devtools';
// TODO set favicon
window.addEventListener('unload', () => {
    devtoolsWindow.close();
});
syncCssVariables(devtoolsWindow);
syncStyles(devtoolsWindow);

// TODO dynamic open/close window with portal

const root = createRoot(devtoolsWindow.document.body);
root.render(<DevTools browserTheme='dark' showTabBar={true} />);

function syncCssVariables(window) {
    window.document.documentElement.setAttribute(
        'style',
        document.documentElement.getAttribute('style'),
    );
    new MutationObserver(() => {
        window.document.documentElement.setAttribute(
            'style',
            document.documentElement.getAttribute('style'),
        );
    }).observe(document.documentElement, {
        attributeFilter: ['style'],
    });
}

function syncStyles(window) {
    for (const link of document.head.getElementsByTagName('link')) {
        console.log('___link added 1');
        window.document.head.appendChild(link.cloneNode());
    }
    new MutationObserver((mutations) => {
        for (const {addedNodes} of mutations) {
            for (const node of (addedNodes || [])) {
                if (node.tagName === 'LINK') {
                    window.document.head.appendChild(node.cloneNode());
                }
            }
        }
    }).observe(document.head, {
        childList: true,
    });
}