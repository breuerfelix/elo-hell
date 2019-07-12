<script context='module'>
	export async function preload(page, session) {
		const res = await this.fetch('user.json');
		const users = await res.json();
		return { users };
	}
</script>

<script>
	export let users;
</script>

<style>
	table {
		width: 100%;
	}

	td, th {
		text-align: center;
		vertical-align: middle;
	}
</style>

<table>
	<tr>
		<th># rank</th>
		<th># username</th>
		<th># elo</th> 
	</tr>
	{#each users as user, rank}
		<tr>
			<td>{rank}</td>
			<td>{user.username}</td>
			<td>{user.elo}</td> 
		</tr>
	{/each}
</table>