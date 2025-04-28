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

function AddAttributes(attributesMap, element)
{
    for(let [attr, value] of attributesMap)
    {
        element.setAttribute(attr, value);
    }
}


async function FetchFromAPI({route, method, body=null}) {
    try {

        let newRequest = {
            method,
            headers: {
                "Content-Type": "application/json",
            }
        };

        if(method.toUpperCase() !== "GET" && body !== null)
        {
            console.log("adding body");
            newRequest.body = JSON.stringify(body);
        }

        const response = await fetch(route, newRequest);

        if (!response.ok) {
            throw new Error(`API HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error:", error);
        throw error;
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

    addElements(elementList)
    {
        for(let element of elementList)
        {
            this.element.appendChild(element);
        }
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
