import React, {Component, ReactNode} from 'react';
import {browser, Bookmarks} from 'webextension-polyfill-ts';
import {match} from 'JSONSelect';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {observer} from 'mobx-react';
import promiseAllProperties from 'promise-all-properties';
import {observable} from 'mobx';
import {BookmarkTreeNode} from './model';
import {AppData} from './model/AppModel';
import Main from './Main';

const rootId = '4921';

@observer
export default class App extends Component {
    data: IPromiseBasedObservable<AppData> = fromPromise(promiseAllProperties({
        root: initModel(),
        expanded: observable([ '4921', '5362'])
    }));

    render(): React.ReactNode {
        return this.data.case({
            fulfilled({root, expanded}: AppData): ReactNode {
                return (
                    <Main root={root} expanded={expanded} />
                );
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
