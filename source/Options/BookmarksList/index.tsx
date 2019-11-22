import React, {Component, ReactElement} from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Folder} from '@material-ui/icons';
import {match} from 'JSONSelect';
import {BookmarkTreeNode} from '../model';

export default class BookmarksList extends Component<{className: string, root: BookmarkTreeNode, treeId: string}>{
    render(): ReactElement {
        const {className, treeId, root} = this.props;
        const children = match(`object:has(:root>.id:val("${treeId}")) > .children`, root)[0] as BookmarkTreeNode[];
        return (
            <main className={className}>
                <List>
                    {
                        children.map(({id, title, children}) => {
                            return (
                                <ListItem key={id}>
                                    {children ? <ListItemIcon><Folder/></ListItemIcon> : null}
                                    <ListItemText primary={title} />
                                </ListItem>
                            );
                        })
                    }
                </List>
            </main>
        );
    }
}