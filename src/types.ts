export interface IMeaning {
	partOfSpeech: string,
	definitions: Array<{
		definition: string,
		example?: string,
	}>,
}

export interface IWord {
	word: string,
	meanings: Array<IMeaning>
}