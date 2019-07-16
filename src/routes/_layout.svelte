<script>
	import Nav from '../components/Nav.svelte';
	import Stack from '@silvancodes/svelte-the-stack';
	import Bracket from '../components/Bracket.svelte';
	
	export let segment;
</script>

<svelte:head>
	<title>Elo-System Fachschaft ET</title>
</svelte:head>

<Stack>
	<Nav {segment}/>

	<Bracket>
		<div slot='center'>
			<slot></slot>
		</div>
	</Bracket>

</Stack>
