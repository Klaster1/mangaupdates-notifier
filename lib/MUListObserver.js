// @ts-check

/** Observes reading list element and calls callback on changes */
class MUListObserver {
	/**
	 * @param {Document} document
	 */
	constructor(document) {
		this._document = document
	}
	/**
	 * Checks that no INPUT elements were added
	 * @param {MutationRecord} record
	 * @returns {boolean}
	 */
	_noInputsWereAdded(record) {
		return [].slice.call(record.addedNodes).every(node => node.nodeName !== 'INPUT')
	}
	/**
	 * Calls callback when predicate returns true
	 * @param {Function} predicate
	 * @param {Function} callback
	 * @returns {MutationCallback}
	 */
	_callIf(predicate, callback) {
		return records => records.forEach(record => predicate(record) && callback(record))
	}
	/**
	 * Starts the observer
	 * @param {string}   listSelector - list element query selector
	 * @param {Function} callback
	 */
	observe(listSelector, callback) {
		const target = this._document.querySelector(listSelector)
		if (!target) return
		new MutationObserver(this._callIf(this._noInputsWereAdded, callback))
		.observe(target, {
			childList: true,
			subtree: true
		})
	}
}