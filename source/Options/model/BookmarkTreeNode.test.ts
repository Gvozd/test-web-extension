import {browser} from 'webextension-polyfill-ts';
import { reaction} from 'mobx';
import {BookmarkTreeNode} from './index';

let tree;
beforeEach(() => {
    Error.stackTraceLimit = 1e3;
    (browser as any)._reset();
    tree = (browser as any)._state.tree;
    jest.useFakeTimers();
});

it('base', () => {
    const node = new BookmarkTreeNode(tree);
    expect(node.title).toEqual('root');
    expect(node.meta).toEqual({tags: []});
    expect(node.children).toHaveLength(1);
});

describe('изменение title', () => {
    it('должен подписываться и отписываться', () => {
        const node: any = new BookmarkTreeNode(tree);
        expect(node.atom.isBeingObserved).toEqual(false);

        const onReaction = jest.fn((val) => {return val;});
        const disposer = reaction(() => {return node.title}, onReaction);
        expect(node.atom.isBeingObserved).toEqual(true);

        node.title = 'root2';
        expect(onReaction).toHaveLastReturnedWith('root2');

        disposer();
        expect(node.atom.isBeingObserved).toEqual(false);

        node.title = 'root3';
        expect(onReaction).toHaveLastReturnedWith('root2');
        expect(onReaction).toHaveBeenCalledTimes(1);
    });

    it('должен реагировать на внешнее изменение', () => {
        const node1: any = new BookmarkTreeNode(tree);
        const node2: any = new BookmarkTreeNode(tree);
        const onReaction = jest.fn(() => null);
        const disposer = reaction(() => node2.title, onReaction);

        node1.title = 'root2';
        expect(node1.title).toEqual('root2');
        expect(node2.title).toEqual('root');

        jest.runAllTimers();
        expect(node2.title).toEqual('root2');

        disposer();
    });

    it('должен сохранятся', () => {
        const node = new BookmarkTreeNode(tree);
        const update = jest.spyOn(browser.bookmarks, 'update');
        node.title = 'root2';
        expect(node.title).toEqual('root2');
        expect(update).lastCalledWith('1', {title: 'root2'});
    });
});

describe('изменение meta', () => {
    it('должен подписываться и отписываться', () => {
        const node: any = new BookmarkTreeNode(tree);
        expect(node.atom.isBeingObserved).toEqual(false);

        const onReaction = jest.fn((val) => {return JSON.parse(val);});
        const disposer = reaction(() => {return JSON.stringify(node.meta)}, onReaction);
        expect(node.atom.isBeingObserved).toEqual(true);

        node.meta = {tags: ['tag 1']};// TODO проверить другие способы изменения
        expect(onReaction).toHaveLastReturnedWith({tags: ['tag 1']});

        disposer();
        expect(node.atom.isBeingObserved).toEqual(false);

        node.meta = {tags: ['tag 2']};
        expect(onReaction).toHaveLastReturnedWith({tags: ['tag 1']});
        expect(onReaction).toHaveBeenCalledTimes(1);
    });


    it('должен реагировать на внешнее изменение', () => {
        const node1: any = new BookmarkTreeNode(tree);
        const node2: any = new BookmarkTreeNode(tree);
        const onReaction = jest.fn(() => null);
        const disposer = reaction(() => node2.meta, onReaction);

        node1.meta = {tags: ['some tag']};// TODO проверить другие способы изменения
        expect(node1.meta).toEqual({tags: ['some tag']});
        expect(node2.meta).toEqual({tags: []});

        jest.runAllTimers();
        expect(node2.meta).toEqual({tags: ['some tag']});

        disposer();
    });

    it('Полная замена', () => {
        const node = new BookmarkTreeNode(tree);
        const update = jest.spyOn(browser.bookmarks, 'update');
        node.meta = {tags: ['some tag']};
        expect(node.title).toEqual('root');
        expect(update).lastCalledWith('1', {title: 'root@@{"tags":["some tag"]}'});
    });
    it.todo('замена только tags');
    it.todo('замена внутри tags');
});