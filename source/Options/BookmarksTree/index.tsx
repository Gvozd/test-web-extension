import {observer} from 'mobx-react';
import React, {Component, ReactElement} from 'react';
import {autobind} from 'core-decorators';
import Tree from 'antd/lib/tree';
import 'antd/lib/tree/style/index.css';
import {AppData} from '../model/AppModel';
import BookmarkOptions from './BookmarkOptions';
import {BookmarkTreeNode} from '../model';

@observer
export default class BookmarksTree extends Component<AppData & {foldersOnly: boolean}> {
    @autobind
    onNodeToggle(nodes: string[]): void {
        const {expanded} = this.props;
        expanded.replace(nodes);
    }

    renderChildren(root: BookmarkTreeNode): ReactElement {
        const {foldersOnly} = this.props;
        const {id, title, children = []} = root;

        return (
            <Tree.TreeNode
                key={id}
                title={
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
                            return this.renderChildren(node);
                        })
                }
            </Tree.TreeNode>
        );
    }

    render(): React.ReactNode  {
        const {root, expanded} = this.props;

        return (
            <Tree
                onExpand={this.onNodeToggle}
                expandedKeys={expanded.slice()}

                // TODO draggable
                // blockNode
                // draggable
                // onDragEnter={this.onDragEnter}
                // onDrop={this.onDrop}

                // TODO icons
                // defaultCollapseIcon={<ExpandMore fontSize='small'/>}
                // defaultExpandIcon={<ChevronRight fontSize='small'/>}
            >
                {
                    this.renderChildren(root)
                }
            </Tree>
        );
    }
}
