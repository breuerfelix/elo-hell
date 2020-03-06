import { config } from 'dotenv';
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import { MongoClient } from 'mongodb';
import { setupTelegram } from './telegram';

// load .env file
config();

const {
	PORT = 80,
	NODE_ENV,
	MONGO_URL = 'mongodb://mongo:27017',
	TELEGRAM_SCHEME = 'https',
	TELEGRAM_TOKEN = null,
	TELEGRAM_HOST = null,
} = process.env;

const dev = NODE_ENV === 'development';

const mongoClient = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect(err => {
	if (err) {
		console.error('mongo error:', err);
		return;
	}

	const db = mongoClient.db('elo');

	// telegram bot
	let telegramBot = null;

	if (TELEGRAM_TOKEN && (TELEGRAM_HOST || dev)) {
		console.log('using telegram bot');
		const url = `${TELEGRAM_SCHEME}://${TELEGRAM_HOST}/telegram.json`;
		telegramBot = setupTelegram(TELEGRAM_TOKEN, url, dev, db);
	}

	function customMiddleware(req, res, next) {
		req.db = db;
		req.telegramBot = telegramBot;
		next();
	}

	polka()
		.use(
			compression({ threshold: 0 }),
			sirv('static', { dev }),
			json(),
			customMiddleware,
			sapper.middleware(),
		)
		.listen(PORT, err => {
			if (err) console.error('polka error:', err);
		});
});
