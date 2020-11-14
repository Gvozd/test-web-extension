import {match} from 'JSONSelect';
import {Bookmarks, Events} from 'webextension-polyfill-ts';

type ChangedHandler = (id: string, changeInfo: Bookmarks.OnChangedChangeInfoType) => void;
type State = {tree: Bookmarks.BookmarkTreeNode, onChangedHandlers: Set<ChangedHandler>};
export type Browser = {
    _state: State,
    _reset: () => void,
    bookmarks: Bookmarks.Static
};
export const browser: Browser = {
    _state: (null as unknown) as State,
    _reset(): void {
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
            addListener(handler: ChangedHandler): void {
                browser._state.onChangedHandlers.add(handler);
            },
        } as Events.Event<ChangedHandler>,
        update(id, properties): Promise<Bookmarks.BookmarkTreeNode> {
            const node = match(`object:has(:root>.id:val("${id}"))`, browser._state.tree)[0] as Bookmarks.BookmarkTreeNode;
            Object.assign(node, properties);
            return new Promise<Bookmarks.BookmarkTreeNode>((resolve) => {
                setTimeout(() => {
                    browser._state.onChangedHandlers.forEach(handler => {
                        handler(id, node);
                    });
                    resolve(node);
                });
            });
        }
    } as Bookmarks.Static,
};

browser._reset();
