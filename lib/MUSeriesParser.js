/** Parses MangaUpdate series page */
class MUSeriesParser {
	static get LIST_SELECTOR() {
		return '#list_table'
	}
	/**
	 * Checks if passed value is a HTMLDocument or not
	 * @param {HTMLDocument|string} htmlOrDocument
	 */
	_isDocument(htmlOrDocument) {
		return typeof htmlOrDocument === 'object'
	}
	/**
	 * Parses text into HTMLDocument
	 *
	 * If value if already a document, returns it as is.
	 * @param {HTMLDocument|string} htmlOrDocument
	 * @returns {HTMLDocument}
	 */
	_maybeParse(htmlOrDocument) {
		if (this._isDocument(htmlOrDocument)) {
			return htmlOrDocument
		} else {
			if (!this._parser) this._parser = new DOMParser()
			return this._parser.parseFromString(htmlOrDocument, 'text/html')
		}
	}
	/**
	 * Extracts latest unread chapter info from series table row
	 * @param {HTMLTableRowElement} tableRowElement - series table row
	 * @returns {number}
	 */
	_rowToUpdate(tableRowElement) {
		const linkElement = tableRowElement.querySelector('.newlist a')
		return linkElement
			? Number.parseInt(linkElement.textContent.match(/\d+/)[0])
			: null
	}
	/**
	 * Extracts series info from table row
	 * @param {HTMLTableRowElement} tableRowElement - series table row
	 * @returns {ISeries}
	 */
	_rowToSeries(tableRowElement) {
		return {
			id: tableRowElement.id,
			title: tableRowElement.querySelector('u').textContent.trim(),
			update: this._rowToUpdate(tableRowElement)
		}
	}
	/**
	 * Extract series from document
	 * @param {HTMLDocument} document
	 * @returns {Array<ISeries>}
	 */
	_extractSeries(document) {
		const listElement = document.querySelector(MUSeriesParser.LIST_SELECTOR)
		if (!listElement) throw new Error('Not authorized')
		return [...listElement.querySelectorAll('tr[id]')].map(this._rowToSeries, this)
	}
	/**
	 * Checks if series has any unread new chapters
	 * @param {ISeries} series
	 */
	_hasUpdate(series) {
		return !!series.update
	}
	/**
	 * Parses document and returns all series
	 * @param {HTMLDocument|string} htmlOrDocument
	 */
	parseSeries(htmlOrDocument) {
		const document = this._maybeParse(htmlOrDocument)
		return this._extractSeries(document)
	}
	/**
	 * Parses document and returns all series with unread new chapters
	 * @param {HTMLDocument|string} htmlOrDocument
	 */
	parseUpdatedSeries(htmlOrDocument) {
		return this.parseSeries(htmlOrDocument).filter(this._hasUpdate)
	}
}