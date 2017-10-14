/** MangaUpdates series */
interface ISeries {
	id: string,
	title: string,
	update: number
}

interface IMessage {
	type: string
}

interface IErrorMessage extends IMessage {
	type: 'error'
}

interface ISeriesMessage extends IMessage {
	type: 'series',
	payload: Array<ISeries>
}

interface IMUExtensionOptions {
	updateInterval: number,
	removeNewLink: boolean
}