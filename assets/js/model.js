export class Player {
    constructor(name, team) {
        this.team = team;
        this.name = name;
        this.serve = "";
        this.transparent = "";
        this.outputHtml = function () {
            return "<div class='player" + this.transparent + "'><span>" + this.team + "</span><p>" + this.name + "</p></div>";
        };
    }

    /**
     * @param {String} serveMark
     */
    setServe(serveMark) {
        this.serve = serveMark;
    }

    setTransparent() {
        this.transparent = " transparent";
    }
}

export class Event{
    constructor(player, playerIndex, eventType){
        this.player = player;
        this.playerIndex = playerIndex;
        this.eventType = eventType;
    }

    getEventType(){
        return this.eventType;
    }

    getplayerIndex(){
        return this.playerIndex;
    }
}
