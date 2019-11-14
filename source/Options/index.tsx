import React from 'react';
import ReactDOM from 'react-dom';
import {browser, Bookmarks} from 'webextension-polyfill-ts';
import {safeLoad} from 'js-yaml';
import * as d3 from 'd3';
import graph from './Graph/miserables.json';
// @ts-ignore
import render from './Graph/ui.js';

import Options from './Options';

ReactDOM.render(<Options />, document.getElementById('options-root'));

(window as typeof window & {d3: typeof d3}).d3 = d3;
const rootId = '4921';

(async function main(): Promise<void> {
    const tree: Bookmarks.BookmarkTreeNode[] = await browser.bookmarks.getTree();

    console.time('get bookmarks');
    const filter = (subtree: Bookmarks.BookmarkTreeNode): boolean => getMetaData(subtree).tags.length > 0;
    for (const subTree of iterate(tree, {filter})) {
        console.log(subTree, getMetaData(subTree).tags);
    }
    console.timeEnd('get bookmarks');
    // type Graph = {
    //     nodes: { id: string, group: number }[],
    //     links: { source: string, target: string, value: number }[]
    // };
    render(graph);
})();

function* iterate(
    tree: Bookmarks.BookmarkTreeNode[],
    {
        filter = (): boolean => {return true},
        needYield = false
    }: {
        filter?: BookmarkTreeNodeFilter,
        needYield?: boolean
    } = {}
): Generator<Bookmarks.BookmarkTreeNode> {
    for (const subTree of tree) {
        const {id, url, children} = subTree;
        if (needYield && url && filter(subTree)) {
            yield subTree;
        }
        if (children) {
            yield* iterate(children, {
                filter,
                needYield: needYield || id === rootId
            });
        }
    }
}
type BookmarkTreeNodeFilter = (node: Bookmarks.BookmarkTreeNode) => boolean;
type BookmarkMeta = { tags: string[] };
function getMetaData({title}: Bookmarks.BookmarkTreeNode): BookmarkMeta {
    const separatedTitle = title.split('@@');
    for (let start = separatedTitle.length - 1; start >= 0; start -= 1) {
        for (let end = separatedTitle.length; end >= start; end -= 1) {
            try {
                const json = safeLoad(separatedTitle.slice(start, end).join('@@')) as BookmarkMeta;
                if (typeof json === 'object' && json.tags) {
                    return json;
                }
            } catch(e) {
                // skip
            }
        }
    }
    return {tags:[]};
}
