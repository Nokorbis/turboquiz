<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    const {supabase} = data;

    let array: any[] = [];

    const channel = supabase.channel('/game-state');
    channel.on('broadcast', {event: 'message' }, (data) => {
        console.log(data);
        array = array.concat(data);
    }).subscribe();

</script>
Stream
{#each array as item}
    <div>{JSON.stringify(item)}</div>
{/each}

