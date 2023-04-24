/**
 *
 *
 * @export
 * @class GameSession
 * @property {number | null} id
 * @property {string} game_date
 * @property {string} name
 * @property {string | null} access_key
 */
export default class GameSession {

    /**
     * Creates an instance of GameSession.
     * @param {object} param
     * @param {string} param.name
     * @param {string} param.game_date
     * @param {string | null} param.access_key
     * @param {number | null} param.id
     */
    constructor({name = '', game_date = '', access_key = null, id = null} = {}) {
        
        if (!game_date) {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            game_date = today.toISOString().substring(0, 10);
        }
        console.log({game_date});

        this.name = name;
        this.game_date = game_date;
        this.id = id;
        this.access_key = access_key;
    }

    validate() {
        if (!this.name) {
            throw new Error('Nom invalide');
        }
        if (!this.game_date) {
            throw new Error('Date invalide');
        }
    }

    
    
};