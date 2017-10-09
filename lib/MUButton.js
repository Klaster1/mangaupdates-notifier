class MUButton {
	static async _wait(duration) {
		return new Promise(resolve => setTimeout(resolve, duration))
	}
	static _shouldBlink(previousCount = 0, currentCount = 0) {
		return +currentCount > +previousCount
	}
	constructor(browserAction) {
		Object.assign(this, {browserAction})
		this._blinkPeriod = 200
		this._regularBadgeColor = '#ee9132'
		this._attentionBadgeColor = 'red'
		this._attentionBlinkTimes = 3
		this._previousCount = 0
		this._enabledIcon = 'icon.svg'
		this._disabledIcon = 'icon-disabled.svg'
		this.browserAction.setBadgeBackgroundColor({color: this._regularBadgeColor})
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
	async setCount(count = 0) {
		const badgeText = count ? count.toString(10) : ''
		this.browserAction.setBadgeText({text: badgeText})
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
		return this.browserAction.setIcon({path: this._disabledIcon})
	}
	async enable() {
		return this.browserAction.setIcon({path: this._enabledIcon})		
	}
	get onClicked() {
		return this.browserAction.onClicked
	}
}