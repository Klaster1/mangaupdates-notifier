const main = async () => {
	const seriesParser = new MUSeriesParser(window.DOMParser)
	const listObserver = new MUListObserver(document, window.MutationObserver)
	const options = await browser.storage.local.get(defaults)

	browser.storage.onChanged.addListener(changes => {
		if (
			'removeNewLink' in changes &&
			changes.removeNewLink.oldValue !== changes.removeNewLink.newValue
		) {
			options.removeNewLink = changes.removeNewLink.newValue
			if (changes.removeNewLink.newValue) syncChapterStatus()
		}
	})

	const checkSeries = () => {
		try {
			const updatedSeries = seriesParser.parseUpdatedSeries(document)
			browser.runtime.sendMessage({type: 'series', payload: updatedSeries})
		} catch (e) {
			browser.runtime.sendMessage({type: 'error', payload: e.message})
			console.error(e)
		}
	}

	const chnum = el => +el.textContent.match(/\d+/)[0]
	const syncChapterStatus = () => document.querySelectorAll(`${MUSeriesParser.LIST_SELECTOR} tr[id]`)
	.forEach(row => {
		const updateLink = row.querySelector('.newlist')
		if (!updateLink) return
		const chapter = chnum(row.querySelector('a[title="Increment Chapter"]'))
		const update = chnum(updateLink)
		if (chapter >= update) updateLink.remove()
	})

	checkSeries()

	listObserver.observe(MUSeriesParser.LIST_SELECTOR, () => {
		if (options.removeNewLink) syncChapterStatus()
		checkSeries()
	})
}
main()