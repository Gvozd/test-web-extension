import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {TreeItem} from '@material-ui/lab';
import {BookmarkTreeNode} from '../model';

@observer
export default class BookmarkTree extends Component<{root: BookmarkTreeNode}> {
    render(): React.ReactNode {
        const {root: {id, title, children = []}} = this.props;
        return (
            <TreeItem nodeId={id} label={title}>
                {
                    children.map(node => {
                        return <BookmarkTree key={node.id} root={node} />;
                    })
                }
            </TreeItem>
        );
    }
}
