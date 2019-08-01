<script context='module'>
	export async function preload(page, session) {
		const res_user = await this.fetch('user.json');
		const res_game = await this.fetch('game.json');
		const users = await res_user.json();
		const games = await res_game.json();

		return { users, games };
	}

	function calcDifference(a,b) {
		return a-b;

	}
</script>

<script>
	export let users;
	export let games;
	export let difference;
</script>

<style>
	table {
		font-size: var(--s0);
	}
	th {
		padding: var(--s1) var(--s3);
	}
	td {
		padding-bottom: var(--s-5);
	}
	td, th {
		text-align: center;
		vertical-align: middle;
	}


    .content-header{
        position: relative;
        padding : 15px 15px 0 15px;
    }
        .content-header > h1,
            .content-header > h1 > small {
            display  	: inline-block;
            font-size 	: 15px;
            padding-left: 4px;
            font-weight : 300;
        }
    .content{
        min-height 		: 250px;
        padding 		: 15px;
        margin-right 	: auto;
        margin-left 	: auto;
    }
    .flex-layout{
        display 		    	: flex;
        flex-direction 			: column;
        flex-wrap 				: nowrap;
        grid-gap 				: 10px;
        grid-template-columns 	: repeat(12, [col] 1fr);
        grid-template-rows 		: repeat(12, [row] 1fr);
        color 					: var(--black);
        margin 					: 0 auto;
    }
        .flex-row{
            padding-bottom 	: 7px;
            margin-bottom 	: 7px;
            /*border 			: 1px solid var(--grey);*/
        }
            div[class*="flex-field-"]{
                padding-right: 14px;
                float 		: left;
            }
            div[class*="flex-field-"]:last-child{
                padding-right: 0;
            }
                .flex-field-12{
                    width: 100%;
                }
                .flex-field-8{
                    width: 66.66666667%;
                }
                .flex-field-4{
        width: 33.33333333%;
    }
</style>

<div id="dashboard">
    <section class="content-header">
        <h1 class="no-margin">Dashboard<small>Version 1.0</small></h1>
    </section>
    <section class="content flex-layout content no-center">
        <div class="flex-row"></div>
        <div class="flex-row"></div>
        <div class="flex-row"></div>
        <div class="flex-row"></div>
    </section>
</div>
