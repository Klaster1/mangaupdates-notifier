'use strict'

const {Cc, Ci} = require('chrome')
const parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser)
const {readURI} = require('sdk/net/url')

const toDoc = text => parser.parseFromString(text, 'text/html')
const toSeries = row => ({
	id: row.id,
	title: row.querySelector('u').textContent.trim(),
	update: toUpdate(row)
})
const toUpdate = row => {
	const link = row.querySelector('.newlist a')
	return link ? Number(link.textContent.match(/\d+/)) : null
}
const filterUpdated = series => series.filter(series => series.update)
const extractSeries = document => {
	const list = document.querySelector('#list_table')
	if (!list) throw 'Not authorised.'
	return [...list.querySelectorAll('tr[id]')].map(toSeries)
}
const listURL = 'https://www.mangaupdates.com/mylist.html'
const getSeriesXHR = () => readURI(listURL).then(toDoc).then(extractSeries)
const getUpdatedSeriesXHR = () => getSeriesXHR().then(filterUpdated)
const getSeriesText = text => extractSeries(toDoc(text))
const getUpdatedSeriesText = text => filterUpdated(getSeriesText(text))

module.exports = {
	getSeriesXHR,
	getUpdatedSeriesXHR,
	getSeriesText,
	getUpdatedSeriesText,
	listURL
}