export async function get(req, res) {
	const { db } = req;

	const games = await db.collection('games').find().toArray();

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(games));
}

export async function post(req, res) {
	const { db, body } = req;

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	await db.collection('games').insertOne({
		...body,
		timestamp: new Date()
	});

	const {
		usersOne, scoreOne,
		usersTwo, scoreTwo
	} = body;

	// TODO calculate the elo here !

	res.end(JSON.stringify({ status: 'ok' }));
}