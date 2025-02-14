function ansestorSelector(element) {
    let currentElement = element;
    const ansestors = [];
    while (currentElement.parentElement) {
        ansestors.push(currentElement);
        currentElement = currentElement.parentElement;
    }
    return ansestors.reverse().map(sl => singleElementSelector(sl));
}



function arraySelector(ansestor_path_selector) {
    return document.querySelector(ansestor_path_selector.join(">"));
}



function singleElementSelector(element) {
    let string = "";
    string += element.tagName.toLowerCase();
    if (element.id) {
        string += "#" + element.id;
    }
    if (element.className) {
        string += "." + element.className;
    }
    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        if (attribute.name === "class") {
            continue;
        }
        string += `[${attribute.name}="${attribute.value}"]`;
    }
    return string;
}

function clickAll(paths){

    for (const path of paths) {
        const element = arraySelector(path);
        if (element) {
            element.click();
        } else {
            alert(`Element not found: ${path}`);
        }
    }
}