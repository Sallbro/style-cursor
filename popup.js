
document.addEventListener("DOMContentLoaded", function () {
    fetch(chrome.runtime.getURL('multi_cursor.json'))
        .then(response => response.json())
        .then(jsonData => {
            jsonData.forEach((item) => {
                create_multi(item.img1, item.img2);
            });
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
        });

    fetch(chrome.runtime.getURL('single_cursor.json'))
        .then(response => response.json())
        .then(jsonData => {
            jsonData.forEach((item) => {
                create_single(item.img1);
            });
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
        });

});


function multicursor_fun(img1, img2) {
    // Convert the parameter to a JSON string
    const parameterJSON = JSON.stringify({ img1, img2 });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // execute script
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: function (parameterJSON) {
                const parameter = JSON.parse(parameterJSON);
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet.insertRule(`html {cursor: url(${parameter.img1}),auto !important; }`);
                style.sheet.insertRule(`button,p,h1,a {cursor: url(${parameter.img2}),auto !important; }`);
            },
            args: [parameterJSON]
        })
    });

}

function singlecursor_fun(img1) {
    // Convert the parameter to a JSON string
    const parameterJSON = JSON.stringify({ img1 });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // execute script
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: function (parameterJSON) {
                const parameter = JSON.parse(parameterJSON);
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet.insertRule(`html {cursor: url(${parameter.img1}),auto !important; }`);
                style.sheet.insertRule(`button,p,h1,a {cursor: url(${parameter.img1}),auto !important; }`);

            },
            args: [parameterJSON]
        })
    });

}

function create_multi(img1, img2) {
    // Create a new div element
    const divElement = document.createElement('div');
    divElement.classList.add('curs_img'); // Adding class to the div

    divElement.onclick = (event) => {
        makeactive(event.target);
        multicursor_fun(img1.src, img2.src);
    }
    // Create the first image element
    const image1 = document.createElement('img');
    image1.src = img1.src;
    image1.alt = img1.alt;
    image1.classList.add('image'); // Adding class to the image

    // Create the second image element
    const image2 = document.createElement('img');
    image2.src = img2.src;
    image2.alt = img2.alt;
    image2.classList.add('image'); // Adding class to the image

    // Append the image elements to the div
    divElement.appendChild(image1);
    divElement.appendChild(image2);

    // Get the container element and append the div to it
    const container = document.querySelector('.multi_cursor');
    container.appendChild(divElement)
}

function create_single(img1) {
    // Create a new div element
    const divElement = document.createElement('div');
    divElement.classList.add('curs_img'); // Adding class to the div

    divElement.onclick = (event) => {
        makeactive(event.target);
        singlecursor_fun(img1.src);
    }
    // Create the first image element
    const image1 = document.createElement('img');
    image1.src = img1.src;
    image1.alt = img1.alt;
    image1.classList.add('image'); // Adding class to the image

    // Append the image elements to the div
    divElement.appendChild(image1);

    // Get the container element and append the div to it
    const container = document.querySelector('.single_cursor');
    container.appendChild(divElement)
}

// add active class
function makeactive(element) {

    const curs_img = document.querySelectorAll(".curs_img");
    curs_img.forEach((item) => {
        item.classList.remove('active');
    });
    if (element.classList[0] == "image") {
        element.parentNode.classList.add('active');

    }
    else {
        element.classList.add('active');
    }
}
