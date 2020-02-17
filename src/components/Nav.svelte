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
		padding: 0 1em;
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
		font-weight: 400;
		text-decoration: none;
		padding: 1em .5em;
		display: block;
	}

	@media screen and (max-width: 620px) and (orientation: portrait) {
		li {
			padding: 0 0;
		}
	}
</style>

<nav>
	<Bracket>
		<div slot='center'>
			<ul>
				<li><a rel=prefetch class:selected={segment === undefined} href='.'>Ranking</a></li>
				<li><a rel=prefetch class:selected={segment === 'games'} href='games'>Games</a></li>
				<li><a rel=prefetch class:selected={segment === 'game'} href='game'>Add Game</a></li>
				<li><a rel=prefetch class:selected={segment === 'user'} href='user'>Add User</a></li>
			</ul>
		</div>
	</Bracket>
</nav>
