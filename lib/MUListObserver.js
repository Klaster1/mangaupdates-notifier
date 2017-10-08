class MUListObserver {
	constructor(document, MutationObserver) {
		Object.assign(this, {document, MutationObserver})
	}
	_noInputsWereAdded(record) {
		return [...record.addedNodes].every(node => node.nodeName !== 'INPUT')
	}
	_callIf(predicate, callback) {
		return records => records.forEach(record => predicate(record) && callback(record))
	}
	observe(listSelector, callback) {
		new this.MutationObserver(this._callIf(this._noInputsWereAdded, callback))
		.observe(this.document.querySelector(listSelector), {
			childList: true,
			subtree: true
		})
	}
}