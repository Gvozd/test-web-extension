import {createAtom, IAtom, computed} from 'mobx';
import {EventEmitter} from 'events';
import {Bookmarks, browser} from 'webextension-polyfill-ts';
import {autobind} from 'core-decorators';
// import {safeLoad} from 'js-yaml';

const nodesEvents = new EventEmitter();
nodesEvents.setMaxListeners(Infinity);
browser.bookmarks.onChanged.addListener((id, data: Bookmarks.OnChangedChangeInfoType) => {
    nodesEvents.emit(`title:${id}`, data.title);
    if ('url' in data) {
        nodesEvents.emit(`url:${id}`, data.url);
    }
});

export class BookmarkTreeNode implements Bookmarks.BookmarkTreeNode {
    constructor(node: Bookmarks.BookmarkTreeNode) {
        this.node = {
            ...node,
            children: node.children?.map((subNode) => {
                return new BookmarkTreeNode(subNode);
            })
        };
    }

    @computed
    get id(): string {
        return this.getNode().id;
    }

    @computed
    get children():  Bookmarks.BookmarkTreeNode[] | undefined {
        return this.getNode().children;
    }

    @computed
    get url(): string | undefined {
        return this.getNode().url;
    }

    @computed
    get title(): string {
        return this.getNode().title || '';
    }

    set title(value: string) {
        this.getNode().title = value;
        browser.bookmarks.update(this.id, {
            title: value
        });
        this.atom.reportChanged();
    }

    // parentId?: string;
    // index?: number;
    // url?: string;
    // title: string;

    private node: Bookmarks.BookmarkTreeNode;

    private atom: IAtom = createAtom('Bookmark events', this.subscribe, this.unsubscribe);

    private getNode(): Bookmarks.BookmarkTreeNode {
        this.atom.reportObserved();
        return this.node;
    }

    // private getMetaData(): BookmarkMeta {
    //     const separatedTitle = this.title.split('@@');
    //     for (let start = separatedTitle.length - 1; start >= 0; start -= 1) {
    //         for (let end = separatedTitle.length; end >= start; end -= 1) {
    //             try {
    //                 const json = safeLoad(separatedTitle.slice(start, end).join('@@')) as BookmarkMeta;
    //                 if (typeof json === 'object' && json.tags) {
    //                     return json;
    //                 }
    //             } catch(e) {
    //                 // skip
    //             }
    //         }
    //     }
    //     return {tags: []};
    // }

    @autobind
    private subscribe(): void {
        nodesEvents.addListener(`title:${this.id}`, this.onChangeTitle);
        nodesEvents.addListener(`url:${this.id}`, this.onChangeUrl);
    }

    @autobind
    private unsubscribe(): void {
        nodesEvents.removeListener(`title:${this.id}`, this.onChangeTitle);
        nodesEvents.removeListener(`url:${this.id}`, this.onChangeUrl);
    }

    @autobind
    private onChangeTitle(title: string): void {
        this.getNode().title = title;
        this.atom.reportChanged();
    }

    @autobind
    private onChangeUrl(url: string): void {
        this.getNode().url = url;
        this.atom.reportChanged();
    }
}

export type BookmarkMeta = {
    tags: string[]
};