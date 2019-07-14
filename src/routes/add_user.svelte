<script>
	import Stack from '@silvancodes/svelte-the-stack';
    let username = '';

    async function addUser(event) {
        const res = await fetch('user.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // reset username
        username = '';
        alert('User added.');
    }
</script>

<style>
    h1 {
        margin: var(--s2) 0;
        text-align: center;
    }
</style>

<h1>Add User</h1>

<form on:submit|preventDefault={addUser}>
    <Stack margin='--s2'>
        <input required placeholder='enter username' bind:value={username} type='text'>
        <button type='submit'>add</button>
    </Stack>
</form>