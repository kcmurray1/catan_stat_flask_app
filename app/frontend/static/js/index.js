const DEFAULT_COLORS = ["Blue", "Green", "Red", "Orange", "Brown", "White"]

document.addEventListener("DOMContentLoaded", function()
{
    var game = new Game()
});

class MyForm
{
    constructor(myAction, myMethod)
    {
        this.form = CreateElement({
            name: "form",
            id:"score",
        })

        this.form.setAttribute("action", myAction);
        
        this.form.setAttribute("method", myMethod);

        this.formGroup = CreateElement({
            name: "div",
            classList: ["form-group", "col"]
        });

        this.formRow = CreateElement({
            name: "div",
            classList: "row"
        })


        this.formSubmit = CreateElement({
            name: "button",
            classList: ["btn", "btn-primary"],
            innerHTML: "submit"
        })

        this.formSubmit.setAttribute("type", "submit")
        this.formGroup.appendChild(this.formRow);
        this.formGroup.appendChild(this.formSubmit);

        this.form.appendChild(this.formGroup);
    }

    addInput(label, name)
    {
        let x = new ScoreField({
            label: label,
            myFor: this.form.id,
            name: name
        });
        this.formRow.appendChild(x.formContainer);
    }

}

class ScoreField
{
    constructor({label, myFor, name})
    {
        this.formContainer = CreateElement({
            name: "div",
            classList: "col"
        })

        this.formLabel = CreateElement({
            name: "label",
            innerHTML: label
        });

        this.formLabel.setAttribute("for", myFor);

        this.formInput = CreateElement({
            name: "input",
            classList: "form-control",
            id: name
        });

        this.formInput.setAttribute("name", name);
        this.formInput.setAttribute("type", "number");
        this.formInput.setAttribute("min", "0")
        this.formInput.style = "width: 6ch;"

        this.formContainer.appendChild(this.formLabel);
        this.formContainer.appendChild(this.formInput);

       

    }
}

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
        AddAttributes(new Map([
            ["data-toggle", "list"],
            ["href", `#${this.link}`],
            ["role", "tab"],
            ["aria-controls", this.gameID]
            ]),
            this.tab
        );

    
        this.content = CreateElement({
            name: "div",
            id: this.link,
            classList: ["tab-pane" ,"fade"],
            innerHTML : `Hello ${this.gameID}` 
        })

        AddAttributes(new Map([
            ["role", "tabpanel"],
            ["aria-labelledby", this.tab.id]
        ]), this.content)

        this.rollChartCard = new BootStrapCard({
            title: "<h1>Total</h1>",
        });
    
    }

    updateRollChart({
        newChart,
        header,
    })
    {
        this.rollChartCard.updateBody(newChart.canvas);
        this.rollChartCard.updateHeader(header);
    }
    

    showAllData(winner)
    {
        // Create area to display chart
        FetchFromAPI({
            route: `/games/${this.gameID}`, 
            method: "GET",
        })
        .then(data => {
            let {rolls: playerRolls, players: _} = data["game"]
            this.updateRollChart({
                newChart: new MyBarChart(playerRolls),
                header: `Winner ${winner}`
            })
        })
        .catch(error => console.error("Could not retrieve Game: ", error))

    }

    getGameData()
    {
        
        FetchFromAPI({
            route: `/games/${this.gameID}`, 
            method: "GET",
        })
        .then(data => {

            // Object deconstructing
            let {rolls: playerRolls, players: players, winner} = data["game"]

            this.content.replaceChildren();
            this.rollChartCard.clearCard();
            let allButton = new BasicButton({
                innerHTML: "All",
            });
            allButton.element.onmousedown = () => {
                this.showAllData(winner);
            }
            this.rollChartCard.cardFooter.appendChild(allButton.element)
        
           
            this.updateRollChart({
                newChart: new MyBarChart(playerRolls), 
                header: `Winner ${winner}`
            });
            // Create buttons for each player
            for(let player of players)
            {
                let playerBtn = new BasicButton({
                    innerHTML: player
                }).element
                playerBtn.onmousedown = () => {
                    FetchFromAPI({
                        route: `/players/${player}/${this.gameID}/rolls`, 
                        method: "GET"
                    })
                    .then(data => {
                        let roll_data = data["rolls"];
                        this.updateRollChart({
                            newChart: new MyBarChart(roll_data), 
                            header: player
                        });
                    })
                    .catch(error => console.error("Could not reteive Player: ", error))
                }
                // Create buttons for each player that display individual performance
                this.rollChartCard.cardFooter.appendChild(playerBtn);
            }
            this.content.appendChild(this.rollChartCard.cardContainer)
        })
        .catch(error => console.error("Could not retrieve Game: ", error))
    }
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

        this.gameID = null;
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
        this.gameBtn =  CreateElement({
            name: "button",
            id: "button",
            classList: ["btn" ,"btn-dark"],
            innerHTML: "Start"
        })
        this.gameBtn.onmousedown = () => {this.start()};

        this.quitBtn = new BasicButton({
            innerHTML: "Quit"
        });


        
        this.quitBtn.element.onmousedown = () => {this.endGame()};


        this.rightCard.cardFooter.appendChild(
            this.gameBtn
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
            route: `/games/add-roll/${player.element.id}`, 
            method: "POST",
            body: {roll : this.rollValue}
        })
         .catch(error => console.error("Could not reteive Player: ", error))
    }

    endGame()
    {
        // Create window to update scores
        let testRow = new MyForm(`/games/add-score/${this.gameID}`, "post");
        for(let player of this.players)
        {
            testRow.addInput(`${player.element.id}`, `${player.element.id}`);
        }
        testRow.formSubmit.addEventListener('click', function(event)
        {
            const confirmEnd = window.confirm("Are you sure you want to end the game?");
            if(confirmEnd)
            {
                window.location.reload();
            }
            else
            {
                // Ignore submit if user decides not to end
                event.preventDefault();
            }
        });
        this.leftCard.clearCard();
        this.leftCard.cardBody.replaceChildren(testRow.form);

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
            route: "/games/create", 
            method: "POST",
            body: {"players" : player_info}
        })
        .then(data =>
            {
                this.gameID = data["game_id"] 

                // Mark game as started
                this.hasGameStarted = true;
                this.gameUI();
                // left card displays the current player and is where user can enter information
                this.gameUpdateLeftCard(activePlayer);
                // right card displays current stats
                this.gameUpdateRightCard(activePlayer);

                
                this.gameBtn.onmousedown = () => {this.nextMove()};
                this.gameBtn.innerHTML = "Submit";   

                this.rightCard.cardFooter.appendChild(
                    this.quitBtn.element
                );
            }
        )
        .catch(error => console.error("Could not reteive Player: ", error))

      
        
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
            // route: `/api/player/current-game/${player.element.id}`, 
            route: `/players/${player.element.id}/${this.gameID}/rolls`,
            method: "GET"
        })
            .then(data => {
                this.rightCard.cardTitle.replaceChildren(new MyBarChart(data["rolls"]).canvas);
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