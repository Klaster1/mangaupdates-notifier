/** Like setInterval, but interval can be changed */
class ChangableInterval {
	/**
	 * @param {Function} callback - called every interval
	 * @param {number}   interval - initial interval value
	 */
	constructor(callback, interval) {
		this._callback = callback
		this._intervalID = setInterval(this._callback, interval)
		callback()
	}
	/**
	 * Changes interval and calls callback immideately
	 * @param {number} interval - new interval value
	 */
	changeInterval(interval) {
		this.clearInterval()
		this._intervalID = setInterval(this._callback, interval)
		this._callback()
	}
	clearInterval() {
		clearInterval(this._intervalID)
	}
}