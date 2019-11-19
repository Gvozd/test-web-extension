import React, {Component, SyntheticEvent} from 'react';
import {observer} from 'mobx-react';
import {action} from 'mobx';
import {TreeItem} from '@material-ui/lab';
import {TextField} from '@material-ui/core';
import {autobind} from 'core-decorators';
import {BookmarkTreeNode} from '../model';

@observer
export default class BookmarkTree extends Component<{ root: BookmarkTreeNode }> {
    @autobind
    @action
    private onChangeTitle({target: {value}}:  React.ChangeEvent<HTMLInputElement>): void {
        const {root} = this.props;
        root.title = value;
    }

    @autobind
    stopPropagation(event:  SyntheticEvent<HTMLElement>): void {
        event.stopPropagation();
    }

    render(): React.ReactNode {
        const {root: {id, title, children = []}} = this.props;

        return (
            <TreeItem
                nodeId={id}
                label={
                    <TextField
                        value={title}
                        onChange={this.onChangeTitle}
                        onKeyDown={this.stopPropagation}
                        onClick={this.stopPropagation}
                    />
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
