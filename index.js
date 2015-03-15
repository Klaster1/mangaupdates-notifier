'use strict';

const {setInterval, clearInterval, setTimeout} = require('sdk/timers')
const {ActionButton} = require('sdk/ui/button/action')
const preferences = require('sdk/simple-prefs')
const {prefs} = preferences
const tabs = require('sdk/tabs')
const {PageMod} = require("sdk/page-mod")

const client = require('./lib/mangaupdates-client')

const updater = {
	update () {
		client.getUpdatedSeriesXHR().then(
			series => icon.badge = series.length,
			icon.disable
		)
	},
	start (every = prefs.updateInterval) {
		this.stop()
		this.update()
		this.interval = setInterval(this.update, every * 1000 * 60)
	},
	stop() {
		clearInterval(this.interval)
	}
}

preferences.on('updateInterval', updater.start)

const colors =  {
	normal: '#ee9132',
	attention: 'red'
}

const labels = {
	normal: 'Open reading list.'
}

const icons = {
	normal: {
		18: './icon-18.png',
		32: './icon-32.png',
		36: './icon-36.png',
		64: './icon-64.png'
	},
	disabled: {
		18: './icon-disabled-18.png',
		32: './icon-disabled-32.png',
		36: './icon-disabled-36.png',
		64: './icon-disabled-64.png'
	}
}

const icon = {
	button: ActionButton({
		id: 'mu-button',
		label: labels.normal,
		icon: icons.normal,
		badgeColor: colors.normal,
		onClick: () => tabs.open(client.listURL)
	}),
	set badge (value) {
		this.enable()
		if (value > this.button.badge) this.flash(3)
		return this.button.badge = value || null
	},
	get badge () {
		return this.button.badge
	},
	flash (times = 3) {
		(function loop(button, times) {
			if (!times) return
			button.badgeColor = button.badgeColor === colors.normal ? colors.attention : colors.normal;
			setTimeout(() => loop(button, times-1), 200)
		})(this.button, times*2);
	},
	enable () {
		this.button.label = labels.normal
		this.button.icon = icons.normal
	},
	disable (err) {
		this.button.badge = null
		this.button.label = err
		this.button.icon = icons.disabled
	}
}

PageMod({
	include: client.listURL,
	contentScriptFile: ['./contentScript.js'],
	onAttach: worker => {
		worker.port.on('series', data => {
			icon.badge = client.getUpdatedSeriesText(data).length
		})
		worker.port.on('error', icon.disable)
	}
})

updater.start()