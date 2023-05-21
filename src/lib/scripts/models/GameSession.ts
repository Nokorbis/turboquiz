type IGameSession = {
    name?: string;
    game_date?: string;
    access_key?: string | null;
    id?: number | null;
}

export default class GameSession {
    name: string;
    game_date: string;
    access_key: string | null;
    id: number | null;

    constructor({name = '', game_date = '', access_key= null, id = null}: IGameSession = {}) {
        if (!game_date) {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            game_date = today.toISOString().substring(0, 10);
            console.log({game_date});
        }
        this.name = name;
        this.game_date = game_date;
        this.access_key = access_key;
        this.id = id;
    }

    validate() {
        if (!this.name) {
            throw new Error('Nom invalide');
        }
        if (!this.game_date) {
            throw new Error('Date invalide');
        }
    }

}