import React, {Component, ReactNode} from 'react';
import {browser, Bookmarks} from 'webextension-polyfill-ts';
import {match} from 'JSONSelect';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {observer} from 'mobx-react';
import {BookmarkTreeNode} from './model';

const rootId = '4921';
@observer
export default class App extends Component {
    root: IPromiseBasedObservable<BookmarkTreeNode> = fromPromise(initModel());

    render(): React.ReactNode {
        return this.root.case({
            fulfilled(root: BookmarkTreeNode): ReactNode {
                return <div>Title: {root.title}</div>;
            },
            pending(): ReactNode {
                return <div>Loading...</div>;
            },
            rejected(error: Error): ReactNode {
                return <div>Some error: {error.message}</div>;
            },
        });
    }
}

async function initModel(): Promise<BookmarkTreeNode> {
    const tree = await browser.bookmarks.getTree();
    return new BookmarkTreeNode(match(`object:has(:root>.id:val("${rootId}"))`, tree)[0] as Bookmarks.BookmarkTreeNode);
}
