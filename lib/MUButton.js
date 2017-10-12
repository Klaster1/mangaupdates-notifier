class MUButton {
	static async _wait(duration) {
		return new Promise(resolve => setTimeout(resolve, duration))
	}
	static _shouldBlink(previousCount = 0, currentCount = 0) {
		return +currentCount > +previousCount
	}
	static _ignoreMissingMethods(target) {
		return new Proxy(target, {
			get(target, property) {
				return Reflect.has(target, property)
					? Reflect.get(target, property)
					: () => Promise.resolve()
			}
		})
	}
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
		this._name = this.runtime.getManifest().name
	}
	async _blink({times, color, period}) {
		const startColor = await this.browserAction.getBadgeBackgroundColor({})
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
	_makeTitle(message) {
		return message ? `${this._name} (${message})` : this._name
	}
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
	async disable() {
		this.setCount(0)
		this.browserAction.setTitle({title: this._makeTitle('unauthorized')})
		return this.browserAction.setIcon({path: this._disabledIcon})
	}
	async enable() {
		return this.browserAction.setIcon({path: this._enabledIcon})		
	}
	get onClicked() {
		return this.browserAction.onClicked
	}
}