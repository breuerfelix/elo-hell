const user = [
    { username: 'felix', elo: 2002 },
    { username: 'jonas', elo: 1002 }
];

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(user));
}

export function post(req, res) {
	const { username } = req.body;
	console.log('add user:', username);

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify({ status: 'ok' }));
}