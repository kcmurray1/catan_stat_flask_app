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

    addColumnText(columnText)
    {
        this.element.appendChild(
            CreateElement({
            name: "div",
            classList: ["col"],
            innerHTML: columnText
            })
        );
    }

    addColumnElement(columnElement)
    {
        this.element.appendChild(columnElement);
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
   constructor(name, games, total_score)
   {

        this.container = CreateElement({
            name: "div",
            classList: "stats-container"
        })

        this.firstRow = new BootstrapRow("first-row", "row");
        this.firstRow.addColumnText(name);

        this.basicInfo = CreateElement({
            name: "div",
            classList: ["col"]
        });
        this.basicInfo.appendChild(
            CreateElement({
                name: "p",
                innerHTML: "Rank"
            })
        );

        this.basicInfo.appendChild(
            CreateElement({
                name: "p",
                innerHTML: total_score
            })
        );

        this.firstRow.addColumnElement(this.basicInfo);

        let secondRow = new BootstrapRow("second-row", "row");

        secondRow.addColumnElement(this.createGamesList(games));
    
        this.container.appendChild(this.firstRow.element);
        
        this.container.appendChild(secondRow.element);

   }

   createGamesList(games)
   {
     let gameListContainer = CreateElement({
        name: "section",
        id: "gameList-container",
        classList: "container",
        innerHTML: "Games"
     })

     let gameListColumn = CreateElement({
        name: "span",
        id: "gameList-col",
        classList: "col"
     })

     for(let x of games)
     {
        let item = new BootstrapGroupItem(x.id);
        let itemContent = new BootstrapRow(x.id, ["row"])
        itemContent.addRowText(x.date)
        item.addItem(itemContent.element);
        gameListColumn.appendChild(
            item.element
        );
     }

     gameListContainer.appendChild(gameListColumn);

     return gameListContainer;


   }
}