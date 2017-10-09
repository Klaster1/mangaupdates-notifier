class ChangableInterval {
	constructor(callback, interval) {
		this._callback = callback
		this._intervalID = setInterval(this._callback, interval)
		callback()
	}
	changeInterval(interval) {
		this.clearInterval()
		this._intervalID = setInterval(this._callback, interval)
		this._callback()
	}
	clearInterval() {
		clearInterval(this._intervalID)
	}
}