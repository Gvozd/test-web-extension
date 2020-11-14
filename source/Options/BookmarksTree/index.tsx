import {observer} from 'mobx-react';
import React, {Component, ReactElement} from 'react';
import {autobind} from 'core-decorators';
import {Tree} from 'antd';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {AppData} from '../model/AppModel';
import BookmarkOptions from '../BookmarkOptions';
import {BookmarkTreeNode} from '../model';

@observer
class BookmarksTree extends Component<AppData & {foldersOnly: boolean} & RouteComponentProps<{treeId: string}>> {
    @autobind
    onNodeToggle(nodes: string[]): void {
        const {expanded} = this.props;
        expanded.replace(nodes);
    }

    @autobind
    onSelect([treeId = this.props.match.params.treeId]: string[]): void {// eslint-disable-line react/destructuring-assignment
        const {history} = this.props;
        history.push(`/main/${treeId}`);
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
        const {root, expanded, match: {params: {treeId}}} = this.props;

        return (
            <Tree
                onExpand={this.onNodeToggle}
                expandedKeys={expanded.slice()}

                selectedKeys={[treeId]}
                onSelect={this.onSelect}
                style={{userSelect: 'none'}}

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

export default withRouter(BookmarksTree);