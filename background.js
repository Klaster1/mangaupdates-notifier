const minToMs = min => min * 1000 * 60

const main = async () => {
	const button = new MUButton(browser.browserAction)
	const seriesParser = new MUSeriesParser(window.DOMParser)
	const client = new MUClient(window.fetch.bind(window))
	const options = await browser.storage.local.get(defaults)

	const fetchList = async () => {
		try {
			const rawList = await client.getList()
			const updatedSeries = seriesParser.parseUpdatedSeries(rawList)
			button.enable()
			button.setCount(updatedSeries.length)
		} catch (e) {
			button.disable()			
		}
	}

	const openTab = () => browser.tabs.create({
		url: MUClient.LIST_URL
	})

	const onMessage = (message) => {
		switch (message.type) {
			case 'error': {
				button.disable()
				break;
			}
			case 'series': {
				button.enable()
				button.setCount(message.payload.length)
			}
		}
	}

	const interval = new ChangableInterval(fetchList, minToMs(options.updateInterval))

	const onStoreChanges = (changes, area) => {
		if (
			'updateInterval' in changes &&
			changes.updateInterval.oldValue !== changes.updateInterval.newValue
		) {
			options.updateInterval = changes.updateInterval.newValue
			interval.changeInterval(minToMs(options.updateInterval))
		}
	}

	browser.storage.onChanged.addListener(onStoreChanges)
	button.onClicked.addListener(openTab)
	browser.runtime.onMessage.addListener(onMessage)
}
main()