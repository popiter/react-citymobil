export default class Service {
	constructor() {
		this._apiBase = 'https://city-mobil.ru/api'
	}

	getResource = async (url) => {
		const res = await fetch(`${this._apiBase}${url}`)

		if (!res.ok) {
			throw new Error(`Адресс ${url} статус ${res.status}`)
		}

		return await res.json()
	}

	getCars = async () => {
		return await this.getResource(`/cars`)
	}
}