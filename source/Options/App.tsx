import React, {Component, ReactNode} from 'react';
import {browser, Bookmarks} from 'webextension-polyfill-ts';
import {match} from 'JSONSelect';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {observer} from 'mobx-react';
import {TreeView} from '@material-ui/lab';
import {ExpandMore, ChevronRight} from '@material-ui/icons';
import promiseAllProperties from 'promise-all-properties';
import {IObservableArray, observable} from 'mobx';
import {BookmarkTreeNode} from './model';
import BookmarkTree from './BookmarkTree';

const rootId = '4921';
type AppData = {
    root: BookmarkTreeNode,
    expanded: IObservableArray<string>
};

@observer
export default class App extends Component {
    data: IPromiseBasedObservable<AppData> = fromPromise(promiseAllProperties({
        root: initModel(),
        expanded: observable([ '1084', '1085'])
    }));

    render(): React.ReactNode {
        return this.data.case({
            fulfilled({root, expanded}: AppData): ReactNode {
                return (
                    <TreeView
                        expanded={expanded}
                        onNodeToggle={(_ev, nodes): void => {
                            // TODO вынести все в отдельный компонент, а хэндлер сделать методом
                            console.log([...expanded], nodes);
                            expanded.replace(nodes);
                        }}
                        defaultCollapseIcon={<ExpandMore />}
                        defaultExpandIcon={<ChevronRight />}
                    >
                        <BookmarkTree root={root} />
                    </TreeView>
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
