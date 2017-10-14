// @ts-check

/**
 * Converts minutes to miliseconds
 * @param {number} min
 */
const minToMs = min => min * 1000 * 60

const background = async () => {
	const button = new MUButton(browser.browserAction, browser.runtime)
	const seriesParser = new MUSeriesParser()
	const client = new MUClient()
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

	/** @param {IErrorMessage|ISeriesMessage} message */
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
background()