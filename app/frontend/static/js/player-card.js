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
class PlayerCard
{
    
    constructor(playerName, playerID)
    {
    this.gameID = playerID;
    this.link = `list-${this.gameID}`

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

    }
}