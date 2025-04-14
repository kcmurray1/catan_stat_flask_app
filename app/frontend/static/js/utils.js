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
        const response = await fetch(
            route, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error:", error);
        throw error; // Propagate the error if needed
    }
}
