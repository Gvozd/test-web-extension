import React, {Component, ReactElement} from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Folder} from '@material-ui/icons';
import {match} from 'JSONSelect';
import {BookmarkTreeNode} from '../model';
import BookmarkOptions from '../BookmarkOptions';

export default class BookmarksList extends Component<{className: string, root: BookmarkTreeNode, treeId: string}>{
    render(): ReactElement {
        const {className, treeId, root} = this.props;
        const children = match(`object:has(:root>.id:val("${treeId}")) > .children`, root)[0] as BookmarkTreeNode[];
        return (
            <main className={className}>
                <List>
                    {
                        children.map((node) => {
                            const {id, title, children} = node;
                            return (
                                <ListItem key={id}>
                                    {children ? <ListItemIcon><Folder/></ListItemIcon> : null}
                                    <ListItemText primary={
                                        <>
                                            {title}
                                            <BookmarkOptions root={node} />
                                        </>
                                    } />
                                </ListItem>
                            );
                        })
                    }
                </List>
            </main>
        );
    }
}