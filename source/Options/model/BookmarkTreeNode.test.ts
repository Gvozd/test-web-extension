/* eslint dot-notation: [2, { "allowPattern": "^atom$" }] */
import {Bookmarks, browser} from 'webextension-polyfill-ts';
import {reaction} from 'mobx';
import {Browser} from '../../../__mocks__/webextension-polyfill-ts';
import {BookmarkTreeNode} from './index';

let tree: Bookmarks.BookmarkTreeNode;
beforeEach(() => {
    Error.stackTraceLimit = 1e3;
    (browser as unknown as Browser)._reset();
    tree = (browser as unknown as Browser)._state.tree;
    jest.useFakeTimers();
});

it('base', () => {
    const node = new BookmarkTreeNode(tree);
    expect(node.children).toHaveLength(1);
});

type TestDataType<T, K extends keyof T> = [K, T[K][], { title: string }];

describe.each<TestDataType<BookmarkTreeNode, 'title'> | TestDataType<BookmarkTreeNode, 'meta'>>([
    [
        'title',
        ['root', 'root1', 'root1'],
        {title: 'root1'},
    ],
    [
        'meta',
        [{tags: []}, {tags: ['tag 1']}, {tags: ['tag 2']}],
        {title: 'root@@{"tags":["tag 1"]}'},
        // it.todo('замена только tags');
        // it.todo('замена внутри tags');
    ],
])('работа свойства `%s`', <K extends 'title' | 'meta'>(...[key, [initValue, value1, value2], updateValue]: TestDataType<BookmarkTreeNode, K>) => {
    it('базовое значение после конструирования', () => {
        const node = new BookmarkTreeNode(tree);
        expect(node[key]).toEqual(initValue);
    });

    it('должен сохранятся в Extension API', () => {
        const node = new BookmarkTreeNode(tree);
        const update = jest.spyOn(browser.bookmarks, 'update');

        node[key] = value1;
        expect(node[key]).toEqual(value1);
        expect(update).lastCalledWith('1', updateValue);
    });

    it('при внешнем наблюдении должен подписываться и отписываться на свой атом', () => {
        const node = new BookmarkTreeNode(tree) ;
        expect(node['atom'].isBeingObserved).toEqual(false);

        const onReaction = jest.fn((val) => {return val;});
        const disposer = reaction(() => node[key], onReaction);
        expect(node['atom'].isBeingObserved).toEqual(true);

        node[key] = value1;// TODO проверить другие способы изменения для meta
        expect(onReaction).toHaveLastReturnedWith(value1);

        disposer();
        expect(node['atom'].isBeingObserved).toEqual(false);

        node[key] = value2;
        expect(onReaction).toHaveLastReturnedWith(value1);
        expect(onReaction).toHaveBeenCalledTimes(1);
    });

    it('должен реагировать на внешнее изменение', () => {
        const node1 = new BookmarkTreeNode(tree);
        const node2 = new BookmarkTreeNode(tree);
        const onReaction = jest.fn(() => null);
        const disposer = reaction(() => node2[key], onReaction);

        node1[key] = value1;// TODO проверить другие способы изменения
        expect(node1[key]).toEqual(value1);
        expect(node2[key]).toEqual(initValue);

        jest.runAllTimers();
        expect(node2[key]).toEqual(value1);

        disposer();
    });
});
