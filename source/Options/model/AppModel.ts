import {BookmarkTreeNode} from './index';
import {IObservableArray} from 'mobx';

export type AppData = {
    root: BookmarkTreeNode,
    expanded: IObservableArray<string>
};