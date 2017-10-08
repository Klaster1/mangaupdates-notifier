const seriesParser = new MUSeriesParser(window.DOMParser)
const listObserver = new MUListObserver(document, window.MutationObserver)

const checkSeries = () => {
	try {
		const updatedSeries = seriesParser.parseUpdatedSeries(document)
		browser.runtime.sendMessage({type: 'series', payload: updatedSeries})
		console.log(updatedSeries)
	} catch (e) {
		browser.runtime.sendMessage({type: 'error', payload: e.message})
		console.error(e)
	}
}

checkSeries()
listObserver.observe(MUSeriesParser.LIST_SELECTOR, checkSeries)