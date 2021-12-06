// Script provides methods for sidebar navigation behavior

/**
 * Adds links based on tree element to side bar navigation.
 */
function addSideNavLinks() {
    let tree = JSON.parse(getDataFromSessionStorage(repoName + "Tree"));
    if (!tree) return;

    let decomBlocks = JSON.parse(getDataFromSessionStorage(repoName + "decomBlocks"));
    if (!decomBlocks) return;

    decomBlocks.forEach(function (d) {
        // append button
        let btn = $("<a></a>")
            .html(d)
            .appendTo($("#side_nav_links"))
        $("<i></i>")
            .addClass("fa fa-caret-down")
            .appendTo(btn);

        // add links for each node of block
        let ddLinks = [];
        tree.forEach(function (n) {
            if (n.decomBlock == d) {
                // add node
                let nodeName = n.title.replace(/[^A-Z0-9]/ig, "_").toLowerCase();
                ddLinks.push(
                    $("<a></a>")
                    .attr("onclick", "navLink('" + n.title + "'," + n.id + ")")
                    .attr("href", "#")
                    .html(n.title)
                );
            }
        });
        $("#side_nav_links").append(createDropDownContainer(ddLinks));

        // add listener
        btn.on("click", function () {
            let localALinks = JSON.parse(getDataFromSessionStorage(repoName + "ActiveLinks"));
            if (!localALinks) return;

            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;

            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                let index = localALinks.indexOf(this.innerText)
                localALinks.splice(index, 1);

            } else {
                dropdownContent.style.display = "block";
                localALinks.push(this.innerText);
            }
            keepDataInSessionStorage(repoName + "ActiveLinks", JSON.stringify(localALinks));
        });

        // set currently active links
        let aLinks = JSON.parse(getDataFromSessionStorage(repoName + "ActiveLinks"));
        if (!aLinks) return;
        if (aLinks.includes(btn.text())) {
            btn.next().css("display", "block");
            btn.toggleClass("active");
        }
    });

    // after last link, add some space
    $("<div></div>")
        .outerHeight($("#side_nav_links").outerHeight() * 0.35)
        .appendTo($("#side_nav_links"));
}

/**
 * Gets the path to link
 * @returns path to source
 */
function getLinkPath() {
    if (window.location.href.includes("localhost")) {
        // set path for local development
        return window.location.origin;
    }
    else {
        // get repo name
        let repoName = window.location.pathname.split("/")[1];
        return `${window.location.origin}/${repoName}`;
    }
}

/**
 * Creates a dropdown container
 * @param {Array} linkArray of links to add to the container
 * @returns container element
 */
function createDropDownContainer(linkArray) {
    let ddContainer = $("<div></div>")
        .addClass("dropdown-container");
    linkArray.forEach(function (l) {
        ddContainer.append(l);
    });
    return ddContainer;
}

/**
 * Creates a link element
 * @param {String} title title of node
 * @param {String} id id of node
 */
function navLink(title, id) {
    let node = getNodeByTitle(title);
    $("#info_box").empty();
    addNodeInfos(node, "preview");
    collapseTreeTable();
    updateTreePlot(id);
}
