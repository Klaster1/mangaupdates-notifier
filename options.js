const updateIntervalElement = document.querySelector('#updateInterval')

let options = {}

const restoreOptions = async () => {
	try {
		options = await browser.storage.local.get(defaults)
		updateIntervalElement.value = options.updateInterval
	} catch (e)	{
		console.error(e)
	}
}

updateInterval.addEventListener('input', (e) => {
	const value = e.target.value
	if (value !== options.updateInterval) {
		options.updateInterval = +value
		browser.storage.local.set(options)
	}
})

restoreOptions()