/** MangaUpdates HTTP client */
class MUClient {
	static get LIST_URL() {
		return 'https://www.mangaupdates.com/mylist.html'
	}
	/** Gets series list page */
	async getList() {
		const res = await fetch(MUClient.LIST_URL, {
			credentials: 'include'
		})
		return await res.text()
	}
}