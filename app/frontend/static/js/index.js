// Display 10 initial books
document.addEventListener("DOMContentLoaded", function()
{
    game = new Game()
});

function move()
{
    console.log("hello world");
    document.getElementById("game").innerHTML = "nice job!";
}

class Game
{
    constructor()
    {
        // Create Initial UI
        this.numPlayers = 0

    }


    addPlayer()
    {
        this.numPlayers++;
        console.log(`adding player.. ${this.numPlayers}`);
    }



}