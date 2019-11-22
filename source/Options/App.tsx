import React, {Component, ReactNode} from 'react';
import {browser, Bookmarks} from 'webextension-polyfill-ts';
import {match} from 'JSONSelect';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {observer} from 'mobx-react';
import promiseAllProperties from 'promise-all-properties';
import {observable} from 'mobx';
import {Switch, Redirect, Route, RouteComponentProps} from 'react-router-dom';
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
                    <Switch>
                        <Redirect exact from='/' to={`/main/${root.id}`} />
                        <Redirect exact from='/main' to={`/main/${root.id}`} />
                        <Route path='/main/:treeId?' component={(props: RouteComponentProps<{treeId: string}>): React.ReactElement => {
                            // TODO redirect, если такого treeId нет
                            return <Main {...props} root={root} expanded={expanded} />;
                        }} />
                    </Switch>
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
