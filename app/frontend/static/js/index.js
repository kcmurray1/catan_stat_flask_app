const DEFAULT_COLORS = ["Blue", "Green", "Red", "Orange", "Brown", "White"]

// Display 10 initial books
document.addEventListener("DOMContentLoaded", function()
{
    var game = new Game()
});


class BasicButton
{
    constructor({innerHTML=null})
    {
        this.element = CreateElement({
            name: "button",
            id: `${innerHTML}-button`,
            classList: ["button", "button1"],
            innerHTML: innerHTML
        });
        this.element.style.color = "black";

    }
}

class GameCard
{
    
    constructor(title, gameID)
    {
        this.gameID = gameID;
        this.link = `list-${this.gameID}`

        this.tab = CreateElement({
            name: "a",
            id: `list-${this.gameID}-list`,
            classList: ["list-group-item", "list-group-item-action"],
            innerHTML: title
        });
        this.tab.onclick = () => {
            this.getGameData()
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

        this.rollChartCard = new BootStrapCard({
            title: "<h1>Total</h1>",
        });
    
    }

    updateRollChart(newChart)
    {
        this.rollChartCard.cardBody.replaceChildren(newChart.canvas);
    }
    

    showAllData()
    {
        // Create area to display chart
        FetchFromAPI({
            route: `/api/game-data/${this.gameID}`, 
            method: "POST",
        })
        .then(data => {
            let {rolls: playerRolls, players: _} = data["data"]
            this.rollChartCard.cardBody.replaceChildren(new MyBarChart(playerRolls).canvas)
        })
        .catch(error => console.error("Could not retrieve Game: ", error))

    }

    getGameData()
    {
        
        FetchFromAPI({
            route: `/api/game-data/${this.gameID}`, 
            method: "POST",
        })
        .then(data => {
            this.content.replaceChildren();
            this.rollChartCard.clearCard();
            let allButton = new BasicButton({
                innerHTML: "All",
            });
            allButton.element.onmousedown = () => {
                this.showAllData();
            }
            this.rollChartCard.cardFooter.appendChild(allButton.element)
            // Object deconstructing
            let {rolls: playerRolls, players: players} = data["data"]
           
            this.updateRollChart(new MyBarChart(playerRolls))
            for(let player of players)
            {
           
                let gub = new BasicButton({
                    innerHTML: player
                }).element
                gub.onmousedown = () => {
                    FetchFromAPI({
                        route: `/api/player/${this.gameID}/${player}`, 
                        method: "POST"
                    })
                    .then(data => {
                        let roll_data = data["data"];
                        this.updateRollChart(new MyBarChart(roll_data));
                    })
                    .catch(error => console.error("Could not reteive Player: ", error))
                }
                // Create buttons for each player that display individual performance
                this.rollChartCard.cardFooter.appendChild(gub);
            }
            this.content.appendChild(this.rollChartCard.cardContainer)
        })
        .catch(error => console.error("Could not retrieve Game: ", error))
    }
}

function CreateElement({name, id, classList, innerHTML=null})
{
    let newElement = document.createElement(name);

    if (classList instanceof Array)
    {
        for(let className of classList)
            newElement.classList.add(className);
    }
    else
    {
        newElement.classList.add(classList);
    }

    newElement.id = id;
   
    if(innerHTML)
        newElement.innerHTML = innerHTML;

    return newElement;
}


class Game
{
   
    constructor()
    {
        // Create Initial UI
        this.players = [];
        this.currentPlayer = 0;

        this.element = this.buildUI();
        this.hasGameStarted = false;
        this.rollValue = 0;

    }

    buildUI()
    {

        let element = CreateElement({
            name: "section",
            id: "game",
            classList: "game-container"
        });

        let elementRow = CreateElement({
            name: "div",
            classList : ["row", "justify-content-md-center"]
        });
        
        this.leftContainer = CreateElement({
            name: "div",
            id: "gub",
            classList : ["col-sm-6"]
        })

        this.leftCard = new BootStrapCard({
            header: "Available Colors",  
        })

        this.leftContainer.appendChild(this.leftCard.cardContainer);




        for(let color of DEFAULT_COLORS)
        {
            let player = new PlayerButton(color);
            player.onAdd = () => {this.addPlayer(player)}
            player.onRemove = () =>{this.removePlayer(player)}

            this.leftCard.cardTitle.appendChild(player.element);
        }
        
        
        this.rightContainer = CreateElement({
            name: "div",
            id: "boo",
            classList : "col-sm-6"
        })

        this.rightCard = new BootStrapCard({
            header: "Selected Player",
            
        })
        this.gameButton =  CreateElement({
            name: "button",
            id: "button",
            classList: ["btn" ,"btn-dark"],
            innerHTML: "Start"
        })
        this.gameButton.onmousedown = () => {this.start()};
        this.rightCard.cardFooter.appendChild(
            this.gameButton
        );
       

        this.rightContainer.appendChild(this.rightCard.cardContainer);
        


        elementRow.appendChild(this.leftContainer);
        
        elementRow.appendChild(this.rightContainer);
        element.appendChild(elementRow);

        let idk = document.getElementById("list-home");

        if(idk)
            idk.appendChild(element);

        return element;

    }


    addPlayer(player)
    {
        this.players.push(player);
        this.rightCard.cardTitle.appendChild(player.element);
    }

    removePlayer(player)
    {
        this.players = this.players.filter(function(item) {
            return item.element.id != player.element.id;
        })

        this.leftCard.cardTitle.appendChild(player.element);
    }

    submitRoll(player)
    {
        FetchFromAPI({
            route: `/api/submit-roll/${player.element.id}`, 
            method: "POST",
            body: {roll : this.rollValue}
        })
         .catch(error => console.error("Could not reteive Player: ", error))
    }

    start()
    {
        if(this.players.length < 1){return;}

        let activePlayer = this.players[this.currentPlayer];
        let player_info = []
        for(let player of this.players)
        {
            player.removeListeners();
            player_info.push(player.element.id)
        }
        // Create Game in backend
        FetchFromAPI({
            route: "/api/create-game", 
            method: "POST",
            body: {"players" : player_info}
        })
        .catch(error => console.error("Could not reteive Player: ", error))

        // Mark game as started
        this.hasGameStarted = true;
        this.gameUI();
        // left card displays the current player and is where user can enter information
        this.gameUpdateLeftCard(activePlayer);
        // right card displays current stats
        this.gameUpdateRightCard(activePlayer);

        
        this.gameButton.onmousedown = () => {this.nextMove()};
        this.gameButton.innerHTML = "Submit";   
        
    }
    nextMove()
    {
        // Do nothing if no player
        if(this.players.length < 1){return;}
        let activePlayer = this.players[this.currentPlayer];

        if(this.rollValue < 1){return;}
        // Send roll to backend
        this.submitRoll(activePlayer);
        this.rollValue = null;
        // Move to next player
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        activePlayer = this.players[this.currentPlayer];
        // left card displays the current player and is where user can enter information
        this.gameUpdateLeftCard(activePlayer);
        // right card displays current stats
        this.gameUpdateRightCard(activePlayer);
    }


    gameUI()
    {
        // Update headers
        this.leftCard.updateHeader("Active Player");
        this.rightCard.updateHeader("Player Stats");

        let numberBar = CreateElement({
            name: "div",
            classList: ["btn-toolbar"]
        })

        let numberGroup = CreateElement({
            name: "div",
            classList: ["btn-group", "mr-2", "d-flex" ,"flex-wrap"]
        })

        for(let i = 2; i < 13; i++)
        {
            let numberBtn = CreateElement({
                name: "button",
                classList: ["btn", "btn-dark"],
                innerHTML: `${i}`
            })

            numberBtn.onmousedown = () => {
                this.rollValue = i;
            };

            numberGroup.appendChild(numberBtn)
        }

        numberBar.appendChild(numberGroup);

        this.leftCard.cardFooter.appendChild(numberBar);
    }


    gameUpdateRightCard(player)
    {
        FetchFromAPI({
            route: `/api/player/current-game/${player.element.id}`, 
            method: "POST"
        })
            .then(data => {
                this.rightCard.cardTitle.replaceChildren(new MyBarChart(data).canvas);
            })
            .catch(error => console.error("Could not reteive Player: ", error))
      
    }

    gameUpdateLeftCard(player)
    {
        this.leftCard.updateTitle(
            `hello<br>`
        );
        this.leftCard.cardTitle.replaceChildren(player.element);
    }



}

class PlayerButton
{
    constructor(color)
    {
        this.isPartOfGame = false;
        this.element = CreateElement({
            name: "button",
            id: `${color}-button`,
            classList: ["button", "button1"]
        }) 

        this.element.style.backgroundColor = `${color}`;
        this.element.style.color = "white";

        this.onAdd = () => {}
        this.onRemove = () => {}

        this.element.onmousedown = () =>{
            if(!this.isPartOfGame)
            {
                this.onAdd();
            }
            else
            {
                this.onRemove();
            }

            this.isPartOfGame = !this.isPartOfGame;
        };
        this.element.onmouseenter = () =>{this.element.style.opacity = 0.75}
        
        this.element.onmouseleave = () =>{this.element.style.opacity = 1}
    }

    removeListeners()
    {
        this.element.onmousedown = () =>{};
        this.element.onmouseenter = () =>{};
        
        this.element.onmouseleave = () =>{};
        this.element.disabled = true;
    }
}