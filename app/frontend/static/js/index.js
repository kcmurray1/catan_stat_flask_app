const DEFAULT_COLORS = ["Blue", "Green", "Red", "Orange", "Brown", "White"]

// Display 10 initial books
document.addEventListener("DOMContentLoaded", function()
{
    var game = new Game()
});

function CreateElement({name, id, classList, innerHTML=null})
{
    let newElement = document.createElement(name);

    newElement.id = id;
    if (classList instanceof Array)
    {
        for(let className of classList)
            newElement.classList.add(className);
    }
    else
    {
        newElement.classList.add(classList);
    }
        

    if(innerHTML)
        newElement.innerHTML = innerHTML;

    return newElement;
}

class BootStrapCard
{
    constructor ({id, header, body, title, text, footer})
    {
        this.cardContainer = CreateElement({name: "div", id: id, classList: ["card", "bg-light", "mb-3"]});

        this.cardHeader = CreateElement({
            name: "h1",
            classList: "card-header",
            innerHTML: header
        });

        this.cardBody = CreateElement({
            name: "div",
            classList: "card-body",
            innerHTML: body
        });

        this.cardTitle = CreateElement({
            name: "h5",
            classList: "card-title",
            innerHTML: title
        });


        this.cardText = CreateElement({
            name: "p",
            classList: "card-text",
            innerHTML: text
        });

        this.cardFooter = CreateElement({
            name: "div",
            classList: "card-footer",
            innerHTML: footer
        });

        
        this.cardBody.appendChild(this.cardTitle);
        this.cardBody.appendChild(this.cardText);


        this.cardContainer.appendChild(this.cardHeader);

        this.cardContainer.appendChild(this.cardBody);
        this.cardContainer.appendChild(this.cardFooter);

    }

    updateHeader(content)
    {
        this.cardHeader.innerHTML = content;
    }

    updateBody(content)
    {
        this.cardBody.innerHTML = content;
    }

    updateTitle(content)
    {
        this.cardTitle.innerHTML = content;
    }

    updateText(content)
    {
        this.cardText.innerHTML = content;
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
            classList : "row"
        });
        
        this.leftContainer = CreateElement({
            name: "div",
            id: "gub",
            classList : "col-sm-6"
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
        let nextButton =  CreateElement({
            name: "button",
            id: "button",
            classList: ["btn" ,"btn-dark"],
            innerHTML: "Next"
        })
        nextButton.onmousedown = () => {this.nextMove()};
        this.rightCard.cardFooter.appendChild(
            nextButton
        );
       

        this.rightContainer.appendChild(this.rightCard.cardContainer);
        


        elementRow.appendChild(this.leftContainer);
        
        elementRow.appendChild(this.rightContainer);
        element.appendChild(elementRow);

        let idk = document.getElementById("man");

        if(idk)
            idk.appendChild(element);

        return element;

    }


    addPlayer(player)
    {
        this.players.push(player);
        // player.element.innerHTML = `<p>${this.players.findIndex(function(item){return item.element.id == player.element.id}) + 1}<p>`;
        this.rightCard.cardTitle.appendChild(player.element);
    }

    removePlayer(player)
    {
        this.players = this.players.filter(function(item) {
            return item.element.id != player.element.id;
        })

        this.leftCard.cardTitle.appendChild(player.element);
    }

    nextMove()
    {
        if(this.players.length < 1){return;}
        if(!this.hasGameStarted)
        {
            for(let player of this.players)
            {
                player.removeListeners();
            }

            this.gameUI();
        }
        // Mark game as started
        this.hasGameStarted = true;

        // Update display for current Player
        let activePlayer = this.players[this.currentPlayer];
        // left card displays the current player and is where user can enter information
        this.gameUpdateLeftCard(activePlayer);
        // right card displays current stats
        this.gameUpdateRightCard(activePlayer);
        

        // Update player index
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }


    gameUI()
    {
        // Update headers
        this.leftCard.updateHeader("Active Player");
        this.rightCard.updateHeader("Player Stats");
    }

    gameUpdateRightCard(player)
    {
        this.rightCard.cardTitle.replaceChildren(player.element.id);

    }

    gameUpdateLeftCard(player)
    {
        this.leftCard.updateTitle(
            `hello<br>`
        );
        this.leftCard.cardTitle.appendChild(player.element);

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