<script>
	import Bracket from './Bracket.svelte';

	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav class='border-red'>
	<Bracket>
		<div slot='center'>
			<ul>
				<li><a rel=prefetch class:bg-red-selected={segment === undefined} href='.'>Ranking</a></li>
				<li><a rel=prefetch class:bg-red-selected={segment === 'add_user'} href='add_user'>Add User</a></li>
				<li><a rel=prefetch class:bg-red-selected={segment === 'add_match'} href='add_match'>Add Match</a></li>
				<li><a rel=prefetch class:bg-red-selected={segment === 'all_matches'} href='all_matches'>All Matches</a></li>
			</ul>
		</div>
	</Bracket>
</nav>