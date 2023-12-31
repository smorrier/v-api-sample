import express, { Request, Response } from 'express';
import axios from 'axios';
import { IMeaning, IWord } from './types';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/get-word', async (req: Request, res: Response) => {
	try {
		const word = req.query.word as string;
		if (!word) {
			return res.status(400).json({ error: 'word parameter is required' })
		}

		const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

		const response: undefined | { data: Array<IWord> } = await axios.get(apiUrl).catch(() => undefined);

		if (!response) {
			return res.status(404).json({ error: "Word was not found or was invalid" })
		}

		let exampleUsage: undefined | string;
		response.data.find((entry: IWord) => {
			return entry.meanings.find((meaning: IMeaning) => {
				if (meaning.partOfSpeech === 'verb') {
					const definition = meaning.definitions.find((definition) => definition.example)
					if (definition) {
						exampleUsage = definition.example;
						return true;
					}
				}
			})
		});

		if (exampleUsage) {
			res.json({ exampleUsage });
		} else {
			const definition = response.data[0].meanings[0].definitions[0].definition;
			res.json({ definition });
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

const NUM_DESCRIPTION = 'Please provide a single digit between 0 and 9';
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
app.post('/number-to-word', (req: Request, res: Response) => {
	try {
		if (!req.body.num) {
			res.status(400).json({ error: 'num parameter is required. ' + NUM_DESCRIPTION });
		}

		const num = parseInt(req.body.num);
		if (isNaN(num) || num < 0 || num > 9) {
			return res.status(400).json({ error: 'num parameter was not valid. ' + NUM_DESCRIPTION });
		}

		res.json({ word: WORDS[num] });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/who-made-me', (req: Request, res: Response) => {
	res.json({ creator: 'Sean Morrier', funFact: 'I like bouldering and I am learning Japanese for fun' });
});

export const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

export default app;