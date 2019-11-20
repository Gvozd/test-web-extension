import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {TreeItem} from '@material-ui/lab';
import {BookmarkTreeNode} from '../model';
import BookmarkOptions from './BookmarkOptions';
// import {AppData} from '../model/AppModel';

@observer
export default class BookmarkTree extends Component<{root: BookmarkTreeNode, foldersOnly: boolean}> {
    render(): React.ReactNode {
        const {root, foldersOnly} = this.props;
        const {id, title, children = []} = root;

        return (
            <TreeItem
                nodeId={id}
                label={
                    <>
                        {title}
                        <BookmarkOptions root={root} />
                    </>
                }
            >
                {
                    children
                        .filter(node => {
                            return foldersOnly ? node.children : true;
                        })
                        .map(node => {
                            return <BookmarkTree key={node.id} root={node} foldersOnly={foldersOnly} />;
                        })
                }
            </TreeItem>
        );
    }
}
