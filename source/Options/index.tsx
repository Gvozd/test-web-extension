import './setupDevtools';
import * as React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import {CssBaseline} from '@material-ui/core';
import {nest} from 'recompose';
import {HashRouter} from 'react-router-dom';
// import {browser, Bookmarks} from 'webextension-polyfill-ts';
// import * as d3 from 'd3';
// import render from './Graph/ui.js';
// import {match} from 'JSONSelect';
// import {autorun} from 'mobx';
// import {BookmarkTreeNode} from './model';

import App from './App';

const AppWrapper = nest(
    // StrictMode,//TODO antd@4
    CssBaseline,
    HashRouter
);

ReactDOM.render(
    <AppWrapper><App /></AppWrapper>,
    document.getElementById('options-root')
);

// (window as typeof window & {d3: typeof d3}).d3 = d3;
// const rootId = '4921';

// (async function main(): Promise<void> {
//     const tree: Bookmarks.BookmarkTreeNode[] = await browser.bookmarks.getTree();
//     // const allTags = new Set();
//     // const tagsPairs: { [key: string]: number } = {};
//
//     const rootFolder = new BookmarkTreeNode(match(`object:has(:root>.id:val("${rootId}"))`, tree)[0] as Bookmarks.BookmarkTreeNode);
//     console.log(rootFolder);
//     autorun(() => {
//         console.log('__qwe', rootFolder.title);
//     });
//     rootFolder.title = 'todoist2';
//     debugger;
//
//     // console.time('get bookmarks');
//     // const filter = (subtree: Bookmarks.BookmarkTreeNode): boolean => getMetaData(subtree).tags.length > 0;
//     // for (const subTree of iterate(tree, {filter})) {
//     //     const {tags} = getMetaData(subTree);
//     //     for(const tag of tags) {
//     //         allTags.add(tag);
//     //     }
//     //     for(let i = 0; i < tags.length - 1; i+=1) {
//     //         for(let j = i + 1; j < tags.length; j+=1) {
//     //             const key = JSON.stringify([tags[i], tags[j]].sort());
//     //             tagsPairs[key] = tagsPairs[key] || 0;
//     //             tagsPairs[key] += 1;
//     //         }
//     //     }
//     // }
//     // const myGraph = {
//     //     nodes: [...allTags]
//     //         .map((id, i) => {
//     //             return {id, group: i};
//     //         }),
//     //     links: Object.entries(tagsPairs)
//     //         .map(([key, value]) => {
//     //             const [source, target] = JSON.parse(key);
//     //             return {source, target, value};
//     //         })
//     // };
//     // console.log(myGraph);
//     // console.timeEnd('get bookmarks');
//     // // type Graph = {
//     // //     nodes: { id: string, group: number }[],
//     // //     links: { source: string, target: string, value: number }[]
//     // // };
//     // render(myGraph);
// })();

// function* iterate(
//     tree: Bookmarks.BookmarkTreeNode[],
//     {
//         filter = (): boolean => {return true},
//         needYield = false
//     }: {
//         filter?: BookmarkTreeNodeFilter,
//         needYield?: boolean
//     } = {}
// ): Generator<Bookmarks.BookmarkTreeNode> {
//     for (const subTree of tree) {
//         const {id, url, children} = subTree;
//         if (needYield && url && filter(subTree)) {
//             yield subTree;
//         }
//         if (children) {
//             yield* iterate(children, {
//                 filter,
//                 needYield: needYield || id === rootId
//             });
//         }
//     }
// }
// type BookmarkTreeNodeFilter = (node: Bookmarks.BookmarkTreeNode) => boolean;
// function getMetaData({title}: Bookmarks.BookmarkTreeNode): BookmarkMeta {
//     const separatedTitle = title.split('@@');
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
//     return {tags:[]};
// }
