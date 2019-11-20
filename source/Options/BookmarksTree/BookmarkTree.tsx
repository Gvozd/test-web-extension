import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {TreeItem} from '@material-ui/lab';
import {BookmarkTreeNode} from '../model';
import BookmarkOptions from './BookmarkOptions';

@observer
export default class BookmarkTree extends Component<{ root: BookmarkTreeNode }> {
    render(): React.ReactNode {
        const {root} = this.props;
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
                    children.map(node => {
                        return <BookmarkTree key={node.id} root={node}/>;
                    })
                }
            </TreeItem>
        );
    }
}
