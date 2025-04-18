class PlayerCard
{
    
    constructor(playerName, playerID)
    {
    this.gameID = playerID;
    this.link = `list-${this.gameID}`
    this.username = playerName;

    this.tab = CreateElement({
        name: "a",
        id: `list-${this.gameID}-list`,
        classList: ["list-group-item", "list-group-item-action"],
        innerHTML: playerName
    });
    this.tab.onclick = () => {
        this.getPlayerData()
    }

    this.tab.setAttribute("data-toggle", "list");
    this.tab.href = `#${this.link}`;

    this.tab.setAttribute("role", "tab");
    this.tab.setAttribute("aria-controls", this.gameID)


    this.content = CreateElement({
        name: "div",
        id: this.link,
        classList: ["tab-pane" ,"fade"],
        innerHTML : `Hello ${this.gameID}` 
    })
    this.content.setAttribute("role", "tabpanel")
    this.content.setAttribute("aria-labelledby", this.tab.id)
    }

    getPlayerData()
    {
        FetchFromAPI({
            route: `players/${this.username}/`,
            method: "GET"
        })
        .then(data => {
            let {games_played: games, id: id, name: playerName} = data["player"];

            console.log(playerName);

            this.content.replaceChildren(
                new PlayerDashboard(
                    playerName,
                    games
                ).element
        );
        })
        .catch(error => console.error("Could not retrieve Player: ", error))
    }
}

// constructor ({id, header, body, title, text, footer})

class PlayerDashboard
{
    constructor(playerName,games)
    {
        console.log(games)
        this.card = new BootStrapCard({
            id: `${playerName}-card`,
            header: playerName,
            body: JSON.stringify(games)
        });

        this.element = this.card.cardContainer
    }
}