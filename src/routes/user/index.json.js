export async function get(req, res) {
	const { db } = req;
	const { amount = 10 } = req.query;

	let users = await db.collection('users').find().limit(Number(amount)).toArray();

	users.sort((a, b) => b.elo - a.elo);
	users = users.map(user => ({ ...user, elo: user.elo | 0 }));

	res.writeHead(200, { 'Content-Type': 'application/json' });

	res.end(JSON.stringify(users));
}

export async function post(req, res) {
	const { db, body } = req;
	const { username } = body;

	res.writeHead(200, { 'Content-Type': 'application/json' });

	// ignore case
	const user = await db.collection('users').findOne({ username: new RegExp(`^${username}$`, 'i') });
	if (user) {
		res.end(JSON.stringify({ error: 'Username already taken.' }));
		console.log('error')
		return;
	}

	await db.collection('users')
		.insertOne({ username, elo: 1000, games: 0, wins: 0, diff: 0 });

	res.end(JSON.stringify({ status: 'ok' }));
}
