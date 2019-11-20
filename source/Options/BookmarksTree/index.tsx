import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {TreeView} from '@material-ui/lab';
import {ChevronRight, ExpandMore} from '@material-ui/icons';
import {autobind} from 'core-decorators';
import BookmarkTree from './BookmarkTree';
import {AppData} from '../model/AppModel';

@observer
export default class BookmarksTree extends Component<AppData> {
    @autobind
    onNodeToggle(_ev: React.ChangeEvent<{}>, nodes: string[]): void {
        const {expanded} = this.props;
        expanded.replace(nodes);
    }

    render(): React.ReactNode  {
        const {root, expanded} = this.props;

        return (
            <TreeView
                expanded={expanded.slice()}
                onNodeToggle={this.onNodeToggle}
                defaultCollapseIcon={<ExpandMore fontSize='small'/>}
                defaultExpandIcon={<ChevronRight fontSize='small'/>}
            >
                <BookmarkTree root={root} />
            </TreeView>
        );
    }
}
