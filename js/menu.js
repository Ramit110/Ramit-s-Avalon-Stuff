document.body.onload = makeMenu;

/// Is this better than just using html? Nope, I just think it's funny!
class elementBuilder {
    constructor(tagName) {
        this.node = document.createElement(tagName);
    }

    addChild(child) {
        this.node.appendChild(child)
        return this;
    }

    addClasses(classes) {
        classes.forEach(elem => this.node.classList.add(elem));
        return this;
    }

    createChild(tagName) {
        return new elementBuilder(tagName).setParent(this);
    }

    getNode() {
        return this.node;
    }

    getParent() {
        this.setChildOf(this.parent.getNode());
        return this.parent;
    }

    setAttribute(attribute, value) {
        this.node.setAttribute(attribute, value);
        return this;
    }

    setChildOf(parent) {
        parent.appendChild(this.node);
        return this;
    }

    setInnerHTML(text) {
        this.node.innerHTML = text;
        return this;
    }

    setID(id) {
        this.node.id = id;
        return this;
    }

    setParent(parent) {
        this.parent = parent;
        return this;
    }

    setStyle(styles) {
        this.node.setAttribute('style', styles.join(";"));
        return this;
    }
}

function getURLFromDepth(url) {
    const depth = localStorage.getItem("depth");
    let prefix = depth == 0 ? "./" : "../";
    for(x = 1; x < depth; x++) {
        prefix += "../";
    }
    return prefix + url;
}

function makeCollapsableMenuSegment(segmentName, divID, isShow, linkingButtons) {
    let buttonClasses = ["btn", "btn-toggle", "d-inline-flex",
        "align-items-center", "rounded", "border-0"];
    if (isShow) {
        buttonClasses.push("collapsed");
    }
    let divClasses = ["collapse"];
    if (isShow) {
        divClasses.push("show");
    }

    const toBeReturned = new elementBuilder("li")
        .addClasses(["mb-1"])
            .createChild("button")
            .addClasses(buttonClasses)
            .setAttribute("data-bs-toggle", "collapse")
            .setAttribute("data-bs-target", "#" + divID)
            .setAttribute("aria-expanded", isShow)
            .setInnerHTML(segmentName)
            .getParent()
            
            .createChild("div")
            .addClasses(divClasses)
            .setID(divID)
            
            .createChild("ul")
            .addClasses(["btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small"]);

    linkingButtons.forEach(pair => toBeReturned.createChild("li")
        .createChild("a")
        .addClasses(["link-body-emphasis", "d-inline-flex", "text-decoration-none", "rounded"])
        .setAttribute("href", pair[0])
        .setInnerHTML(pair[1])
        .getParent()
    .getParent());

    return toBeReturned.getParent().getParent();
}

function makeMenu() {
    const main = new elementBuilder("main")
        .addClasses(["d-flex", "flex-nowrap"])
            .createChild("div")
            .addClasses(["flex-shrink-0", "p-3"])
            .setStyle(["width: 280px"])

                .createChild("a")
                .addClasses(["d-flex", "align-items-center", "pb-3", "mb-3",
                    "link-body-emphasis", "text-decoration-none", "border-bottom"])
                .setAttribute('href', getURLFromDepth('./index.html'))
                    .createChild("span")
                    .addClasses(["fs-5", "fw-semibold"])
                    .setInnerHTML("Ramit's Avalon Stuff")
                    .getParent()
                .getParent()

                .createChild("ul")
                .addClasses(["list-unstyled", "ps-0"])
                .addChild(makeCollapsableMenuSegment(
                    "General", "home-menu", true,
                    [[getURLFromDepth("index.html"), "Home"],
                     ["https://github.com/Ramit110/avalon/wiki/Bug-Reporting", "Contribute"],
                     ["https://github.com/Ramit110/avalon/wiki/Contributing", "Report Bugs"]]
                ).getNode())
                .addChild(makeCollapsableMenuSegment(
                    "Pets", "pets-menu", false,
                    [[getURLFromDepth("pets/index.html"), "Basic Training Guides"],
                     [getURLFromDepth("pets/copper.html"), "Copper Hoppers"]]
                ).getNode())
                .getParent()
            .getParent()
        .getNode();
    document.body.appendChild(main);
}
