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
            classList: ["card-footer"],
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