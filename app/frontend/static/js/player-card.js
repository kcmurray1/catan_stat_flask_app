class PCard
{
    constructor(playerName, playerID, score, rank, ignoreLink=false)
    {
        this.gameID = playerID;
        this.link = `stats/${playerName}`
        this.username = playerName;
        
        let tabContent = new BootstrapRow("fastone", ["row"])
        tabContent.addRowText(rank);
        tabContent.addRowText(this.username);
        tabContent.addRowText(score);

        
        this.tab = new BootstrapGroupItem(this.gameID, ignoreLink ? null : this.link)
        this.tab.addItem(tabContent.element);
    }

    render()
    {
        return this.tab.element;
    }
}

class BootstrapRow
{
    constructor(id, classList)
    {
        this.element = CreateElement({
            name: "div",
            id: id,
            classList: classList,
        });
    }

    addRowText(rowTextElement)
    {
        this.element.appendChild(
            CreateElement({
                name: "div",
                classList: "p-2",
                innerHTML: rowTextElement
            })
        )
    }
  
}

class BootstrapGroupItem
{
    constructor(id, link=null)
    {
        this.element = CreateElement({
            name: "a",
            id: `list-${id}-list`,
            classList: ["list-group-item", "list-group-item-action"],
        });

        if(link)
        {
            this.element.href = link;
        }
        
    }

    addItem(groupItemElement)
    {
        this.element.appendChild(groupItemElement);
    }
}

class PlayerDashboard
{
    constructor(playerName, games)
    {
        this.card = new BootStrapCard({
            id: `${playerName}-card`,
            header: playerName,
            body: JSON.stringify(games)
        });

        this.element = this.card.cardContainer
    }
}