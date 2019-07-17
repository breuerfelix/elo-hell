import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import { MongoClient } from 'mongodb';

const url = 'mongodb://mongo:27017/';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect(err => {
	if (err) {
		console.error(err);
		return;
	}

	const db = client.db('elo');
	function database(req, res, next) {
		req.db = db;
		next();
	}

	const { PORT, NODE_ENV } = process.env;
	const dev = NODE_ENV === 'development';

	polka()
		.use(
			compression({ threshold: 0 }),
			sirv('static', { dev }),
			json(),
			database,
			sapper.middleware()
		)
		.listen(PORT, err => {
			if (err) console.log('error', err);
		});
});
