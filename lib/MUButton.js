// @ts-check

/** browserAction button abstraction with extra behavior */
class MUButton {
	/**
	 * Resolves Promise after specified duration
	 * @param {number} duration
	 */
	static async _wait(duration) {
		return new Promise(resolve => setTimeout(resolve, duration))
	}
	/** Determines if button should blink */
	static _shouldBlink(previousCount = 0, currentCount = 0) {
		return +currentCount > +previousCount
	}

	/**
	 * Wraps target with proxy that resolves missing methods to noop function
	 * @template T
	 * @param {T} target
	 * @returns {T}
	 */
	static _ignoreMissingMethods(target) {
		return new Proxy(target, {
			get(target, property) {
				return Reflect.has(target, property)
					? Reflect.get(target, property)
					: () => Promise.resolve()
			}
		})
	}
	/**
	 * @param {browser.browserAction} browserAction
	 * @param {browser.runtime} runtime
	 */
	constructor(browserAction, runtime) {
		this.browserAction = MUButton._ignoreMissingMethods(browserAction)
		this.runtime = runtime
		this._blinkPeriod = 200
		this._regularBadgeColor = '#ee9132'
		this._attentionBadgeColor = 'red'
		this._attentionBlinkTimes = 3
		this._previousCount = 0
		this._enabledIcon = 'icon.svg'
		this._disabledIcon = 'icon-disabled.svg'
		this.browserAction.setBadgeBackgroundColor({color: this._regularBadgeColor})
		/** @type {string} */
		this._name = this.runtime.getManifest().name
	}
	/**
	 * @typedef {Object} IBlinkParams
	 * @prop {number} times
	 * @prop {string} color
	 * @prop {number} period
	 */
	/**
	 * Blinks browserAction background color
	 * @param {IBlinkParams} params
	 */
	async _blink(params) {
		const {times, color, period} = params
		const startColor = await this.browserAction.getBadgeBackgroundColor({})
		/**
		 * Inner loop
		 * @param {number} remainingTimes
		 * @returns {Promise}
		 */
		const loop = async (remainingTimes) => {
			if (!remainingTimes) return
			this.browserAction.setBadgeBackgroundColor({
				color: remainingTimes % 2 ? startColor : color
			})
			await MUButton._wait(period)
			return await loop(remainingTimes - 1)
		}
		return await loop(times * 2)
	}
	/**
	 * Makes a title with specified message
	 * @param {string|number} message
	 */
	_makeTitle(message) {
		return message ? `${this._name} (${message})` : this._name
	}
	/** Sets button count to badge text and title, blinks if necessary */
	async setCount(count = 0) {
		const badgeText = count ? count.toString(10) : ''
		this.browserAction.setBadgeText({text: badgeText})
		this.browserAction.setTitle({title: this._makeTitle(count)})
		if (MUButton._shouldBlink(this._previousCount, count)) {
			await this._blink({
				times: this._attentionBlinkTimes,
				color: this._attentionBadgeColor,
				period: this._blinkPeriod
			})
		}
		this._previousCount = count
	}
	/**
	 * Disabled the button
	 *
	 * Title is set to 'unauthorized' and icon to the greyed out one.
	 */
	async disable() {
		this.setCount(0)
		this.browserAction.setTitle({title: this._makeTitle('unauthorized')})
		return this.browserAction.setIcon({path: this._disabledIcon})
	}
	/**
	 * Enables the button
	 *
	 * Sets icon to the one with orange fill.
	 */
	async enable() {
		return this.browserAction.setIcon({path: this._enabledIcon})		
	}
	get onClicked() {
		return this.browserAction.onClicked
	}
}