class MUClient {
	static get LIST_URL() {
		return 'https://www.mangaupdates.com/mylist.html'
	}
	constructor(fetch) {
		Object.assign(this, {fetch})
	}
	async getList() {
		const res = await this.fetch(this.constructor.LIST_URL, {
			credentials: 'include'
		})
		return await res.text()
	}
}