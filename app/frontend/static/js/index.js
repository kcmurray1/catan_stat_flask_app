const DEFAULT_COLORS = ["Blue", "Green", "Red", "Orange", "Brown", "White"]

// Display 10 initial books
document.addEventListener("DOMContentLoaded", function()
{
    
    var game = new Game()
        

});

function move()
{
    console.log("hello world");
    document.getElementById("game").innerHTML = "nice job!";
}


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

class Game
{
   
    constructor()
    {
        // Create Initial UI
        this.players = [];

        this.element = this.buildUI();

    }

    buildUI()
    {

        let element = CreateElement(
            {name: "section",
            id: "game",
            classList: "game-container"
        });

        let elementRow = CreateElement({
            name: "div",
            classList : "row"
        });
        
        this.unselectedPlayers = CreateElement({
            name: "div",
            id: "gub",
            classList : "col-sm-8",
            innerHTML : `<h1>Select Players</h1>`
        })


          for(let color of DEFAULT_COLORS)
            {
                let player = new PlayerButton(color);
                player.onAdd = () => {this.addPlayer(player)}
                player.onRemove = () =>{this.removePlayer(player)}

                this.unselectedPlayers.appendChild(player.element);
            }
        
        
        this.rightElement = CreateElement({
            name: "div",
            id: "boo",
            classList : "col-sm-4",
            innerHTML : `<h1>Players</h1>`
        })


        elementRow.appendChild(this.unselectedPlayers);
        
        elementRow.appendChild(this.rightElement);
        element.appendChild(elementRow);

        let idk = document.getElementById("man");

        if(idk)
            idk.appendChild(element);

        return element;

    }


    addPlayer(player)
    {
        this.players.push(player);
        this.rightElement.appendChild(player.element);
    }

    removePlayer(player)
    {
        this.players = this.players.filter(function(item) {
            return item.element.id != player.element.id;
        })

        this.unselectedPlayers.appendChild(player.element);
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

        this.handle
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
}