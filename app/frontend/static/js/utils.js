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
