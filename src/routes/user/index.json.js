export async function get(req, res) {
	const { db } = req;

	const users = await db.collection('users').find().toArray();

	const nullUsers = users.filter(({ elo }) => elo == null);
	const sortedUsers = users.filter(({ elo }) => elo != null)
							.sort((a, b) => b.elo - a.elo)
							.push(...nullUsers);

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(users));
}

export async function post(req, res) {
	const { db, body } = req;
	const { username } = body;

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	const user = await db.collection('users').findOne({ username });
	if (user) {
		res.end(JSON.stringify({ error: 'Username already taken.' }));
		console.log('error')
		return;
	}

	await db.collection('users').insertOne({ username, elo: 1000 });

	res.end(JSON.stringify({ status: 'ok' }));
}