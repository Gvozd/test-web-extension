import {match} from 'JSONSelect';

export const browser = {
    _state: null,
    _reset() {
        browser._state = {
            tree: {
                id: '1',
                title: 'root',
                children: [
                    {
                        id: '2',
                        title: 'link',
                        url: 'http://some-url'
                    }
                ]
            },
            onChangedHandlers: new Set()
        };
    },

    bookmarks: {
        onChanged: {
            addListener(handler) {
                browser._state.onChangedHandlers.add(handler);
            },
        },
        update(id, properties) {
            const node = match(`object:has(:root>.id:val("${id}"))`, browser._state.tree)[0];
            Object.assign(node, properties);
            setTimeout(() => {
                browser._state.onChangedHandlers.forEach(handler => {
                    handler(id, properties);
                });
            });
        }
    },
};

browser._reset();
