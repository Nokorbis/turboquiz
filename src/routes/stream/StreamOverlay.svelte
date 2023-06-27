<div class="overlay-display">
    <div class="turbo-logo">
        <img src="/turbo-quiz-logo.png" alt="" />
    </div>
    <div class="chat-box" />
    <div class="streamer-cam" />
    <div class="followers">
        <div class="last-sub">
            <div class="header">Dernier sub</div>
        </div>
        <div class="last-sub">
            <div class="header">Dernier follower</div>
        </div>
    </div>
</div>

<style>
    .overlay-display {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 35px 30px;
        gap: 20px;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }

    .chat-box {
        margin-inline: auto;
        width: 320px;
        height: 350px;
        border: 8px solid white;
        border-radius: 1.5rem;
    }

    .streamer-cam {
        width: 320px;
        height: 200px;
        margin-inline: auto;
        border: 8px solid white;
        border-radius: 1.5rem;
    }

    .followers {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 45px;
    }

    .last-sub {
        width: 320px;
        height: 92px;
        position: relative;
        border: 8px solid white;
        border-radius: 1.5rem;
    }

    .last-sub .header {
        height: 46px;
        width: max-content;
        position: absolute;
        top: -29px;
        right: 1rem;
        background-color: #2d3142;
        border-radius: 0.5rem;
        padding: 5px 10px;
        font-size: 1.5rem;
        font-weight: bold;
        font-family: 'Archivo';
        word-spacing: 3px;
    }
</style>
