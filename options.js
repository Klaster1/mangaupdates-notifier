const updateIntervalElement = document.querySelector('#updateInterval')
const removeNewLink = document.querySelector('#removeNewLink')

let options = {}

const restoreOptions = async () => {
	try {
		options = await browser.storage.local.get(defaults)
		updateIntervalElement.value = options.updateInterval
		removeNewLink.checked = options.removeNewLink
	} catch (e)	{
		console.error(e)
	}
}

updateInterval.addEventListener('input', e => {
	const value = e.target.value
	if (value !== options.updateInterval) {
		options.updateInterval = +value
		browser.storage.local.set(options)
	}
})

removeNewLink.addEventListener('input', e => {
	const value = e.target.checked
	if (value !== options.removeNewLink) {
		options.removeNewLink = value
		browser.storage.local.set(options)
	}
})

restoreOptions()