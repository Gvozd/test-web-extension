import {observable /* , createAtom, autorun */ } from 'mobx';
// import {bookmarks} from 'webextension-polyfill';

export class BookmarkTreeNode {
    @observable
    children: BookmarkTreeNode[] | undefined;
};

console.log(BookmarkTreeNode)