import {EventEmitter} from 'events';
import {Bookmarks, browser} from 'webextension-polyfill-ts';

export const BookmarksObserver = new EventEmitter();

export function subscribe(): void {
    BookmarksObserver.setMaxListeners(Infinity);
    browser.bookmarks.onChanged.addListener(onChanged);
};

function onChanged(id: string, data: Bookmarks.OnChangedChangeInfoType): void {
    BookmarksObserver.emit(`title:${id}`, data.title);
    if ('url' in data) {
        BookmarksObserver.emit(`url:${id}`, data.url);
    }
}
