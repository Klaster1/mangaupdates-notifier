'use strict'

const list = document.querySelector('#list_table');
const emitSeries = () => self.port.emit('series', list.outerHTML);
const emitError = () => self.port.emit('error', 'Not authorised.');
const noInputs = rec => [...rec.addedNodes].every(node => node.nodeName !== 'INPUT');
const callIf = (pred, fn) => records => records.forEach(record => pred(record) && fn(record));
const observe = (el, fn) => new MutationObserver(callIf(noInputs, fn)).observe(el, {
	childList: true,
	subtree: true
});
const chnum = el => +el.textContent.match(/\d+/)[0];
const syncChapterStatus = () => [...list.querySelectorAll('tr[id]')].forEach(row => {
	const updateLink = row.querySelector('.newlist');
	if (!updateLink) return;
	const chapter = chnum(row.querySelector('a[title="Increment Chapter"]'));
	const update = chnum(updateLink);
	if (chapter >= update) updateLink.parentNode.removeChild(updateLink)
});

let prefs = {};
self.port.on('prefs', data => prefs = JSON.parse(data));

try {
	emitSeries();
}
catch (e) {
	emitError();
}

observe(list, () => {
	if (prefs.removeNewLink) syncChapterStatus();
	emitSeries();
});