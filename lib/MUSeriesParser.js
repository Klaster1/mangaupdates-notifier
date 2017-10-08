class MUSeriesParser {
	static get LIST_SELECTOR() {
		return '#list_table'
	}
	constructor(DOMParser) {
		Object.assign(this, {DOMParser})
	}
	_isDocument(htmlOrDocument) {
		return typeof htmlOrDocument === 'object'
	}
	_maybeParse(htmlOrDocument) {
		if (this._isDocument(htmlOrDocument)) {
			return htmlOrDocument
		} else {
			if (!this._parser) this._parser = new this.DOMParser
			return this._parser.parseFromString(htmlOrDocument, 'text/html')
		}
	}
	_rowToUpdate(tableRowElement) {
		const linkElement = tableRowElement.querySelector('.newlist a')
		return linkElement ? Number.parseInt(linkElement.textContent.match(/\d+/)) : null
	}
	_rowToSeries(tableRowElement) {
		return {
			id: tableRowElement.id,
			title: tableRowElement.querySelector('u').textContent.trim(),
			update: this._rowToUpdate(tableRowElement)
		}
	}
	_extractSeries(document) {
		const listElement = document.querySelector(this.constructor.LIST_SELECTOR)
		if (!listElement) throw new Error('Not authorized')
		return [...listElement.querySelectorAll('tr[id]')].map(row => this._rowToSeries(row))
	}
	_hasUpdate(series) {
		return series.update
	}
	parseSeries(htmlOrDocument) {
		const document = this._maybeParse(htmlOrDocument)
		return this._extractSeries(document)
	}
	parseUpdatedSeries(htmlOrDocument) {
		return this.parseSeries(htmlOrDocument).filter(this._hasUpdate)
	}
}