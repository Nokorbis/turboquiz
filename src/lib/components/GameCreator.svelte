<script>
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
	import GameSession from "$lib/scripts/models/GameSession";

    let gameSession = new GameSession();

    function createGameSession() {
        try {
            gameSession.validate();
            if ($modalStore[0] && $modalStore[0].response) {
                $modalStore[0].response(gameSession);
            }
            else {
                alert('Une erreur est survenue avec $modalStore[0].response');
            }
        }
        catch (error) {
            toastStore.trigger( {
                message: error.message,
                timeout: 2000,
                background: 'variant-filled-error'
            });
        }
        
    }
</script>

<div class="card bg-white p-4">
    <label class="label" for="">Date</label>
    <input type="date" class="input" bind:value={gameSession.game_date}>
    <label class="label mt-2" for="">Nom</label>
    <input type="text" class="input" bind:value={gameSession.name}>
    <div class="mt-2 text-right">
        <button class="btn variant-filled" on:click={createGameSession}>Créer</button>
    </div>
    
</div>
