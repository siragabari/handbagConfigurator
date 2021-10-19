"use-strict";
window.addEventListener('DOMContentLoaded', load);

let selectedColor = "transparent";
const features = {
    keychain: false,
    pin: false,
    object: false,
};
const selectedList = document.getElementById("selectedList");

async function load() {

    // Load handbag image
    const response = await fetch("assets/bag-01.svg");
    const data = await response.text();
    document.getElementById("handbag").innerHTML = data;
    // Assigning a class to the parts of the handbag
    document.getElementById("body").classList.add("g_to_interact_with");
    document.getElementById("rectangle").classList.add("g_to_interact_with");
    document.getElementById("handle").classList.add("g_to_interact_with");
    document.getElementById("triangles").classList.add("g_to_interact_with");

    // // Load keychain feature
    const response1 = await fetch("assets/keychain.svg");
    const data1 = await response1.text();
    document.getElementById("keychain").innerHTML = data1;
    document.getElementById("keychainLayer").classList.add("g_to_interact_with");

    // Load tassel feature
    const response2 = await fetch("assets/tassel.svg");
    const data2 = await response2.text();
    document.getElementById("tassel").innerHTML = data2;
    document.getElementById("tasselLayer").classList.add("g_to_interact_with");

    // Load ribbon feature
    const response3 = await fetch("assets/ribbon.svg");
    const data3 = await response3.text();
    document.getElementById("ribbon").innerHTML = data3;
    document.getElementById("ribbonLayer").classList.add("g_to_interact_with");

    // Load butterfly feature
    const response4 = await fetch("assets/butterfly.svg");
    const data4 = await response4.text();
    document.getElementById("butterfly").innerHTML = data4;
    document.getElementById("butterflyLayer").classList.add("g_to_interact_with");

    // Load flower feature
    const response5 = await fetch("assets/flower.svg");
    const data5 = await response5.text();
    document.getElementById("flower").innerHTML = data5;
    document.getElementById("flowerLayer").classList.add("g_to_interact_with");

    start();
}

function start() {
    // Make the handbag parts clickable
    document.querySelectorAll(".g_to_interact_with").forEach(selectBagPart);

    // Reset button
    resetPreview();

    // Add and delete features
    document.querySelectorAll(".feature").forEach(function(feature) {
        feature.addEventListener('click', function(event) {
            handleFeatures(event);
        });
    });

    // Select a color
    document.querySelectorAll(".color").forEach(selectColor);
    // Add a color
    addNewColor();
}

function resetPreview() {
    document.getElementById("reset").addEventListener('click', function() {
        // Reset the selected features list
        if (selectedList.getElementsByTagName("li").length > 0) {
            for(let i=0; i<=selectedList.getElementsByTagName("li").length; i++) {
                selectedList.removeChild(selectedList.firstChild);
            }
        }

        // Reset the preview features
        document.querySelectorAll(".feature").forEach(function(feature) {
            feature.classList.add("hide");
        });

        // Reset the features
        document.querySelectorAll(".feature").forEach(function(feature) {
            feature.classList.remove("chosenFeature");
        });

        // Reset the color of the items
        document.querySelectorAll(".g_to_interact_with").forEach(function(element) {
            element.querySelectorAll('*').forEach(function(e) {
                e.setAttribute("fill", "transparent");
            });
        });

        // Reset the selected color
        selectedColor = "transparent";
        document.querySelectorAll(".color").forEach(function(e) {
            e.classList.remove("chosenColor");
        });
    });
}

// /**
//  * CHANGING COLORS
//  */

function selectBagPart(element) {
    // Hover the handbag parts
    hovering(element);

    // Fill the handbag parts with the selected color
    element.addEventListener('click', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.setAttribute("fill", selectedColor);
        });
    });
}

function hovering(element) {
    // Colour the handbag parts
    element.addEventListener('mouseover', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.add("over");
        });
    });
    // Uncolour the handbag parts
    element.addEventListener('mouseout', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.remove("over");
        });
    });
}

// /**
//  * SELECT COLORS
//  */

function selectColor(element) {
    // Select a color from the palette
    element.addEventListener('click', function() {
        selectedColor = element.style.backgroundColor;
        document.querySelectorAll(".color").forEach(function(e) {
            e.classList.remove("chosenColor");
        });
        element.classList.add("chosenColor");
    });
}

function addNewColor() {
    document.getElementById("addColor").addEventListener('click', function() {
        // Create a message to introduce a new color
        let text = prompt("Please enter a valid hex code (ex.: #ffffff):", "#ffffff");
        if (text == null || text == "" || text.length != 7) {
            // Show error message
            console.log("no color detected");
        } else {
            // Add new color to palette
            const newColor = document.createElement("div");
            newColor.classList.add("color");
            newColor.style.backgroundColor = text;
            
            const colorCode = document.createElement("label");
            colorCode.innerHTML = text;
            newColor.append(colorCode);
            
            selectColor(newColor);
            document.getElementById("addColor").parentNode.insertBefore(newColor,  document.getElementById("addColor").nextSibling);
        }
    });
}


// /**
//  * CHANGING FEATURES
//  */

function handleFeatures(event) {
    // Select a feature
    const target = event.currentTarget;
    const feature = target.dataset.feature;

    // Add the feature to the preview
    const add = restrictions(feature);
    if (!features[feature]) {
        // Check restrinctions
        if (add) {
            addFeature(feature);
        }
    }else {
        deleteFeature(feature);
    }
}


function restrictions(feature) {
    let add = false;
    // Keychain restrictions
    if (feature === "keychain") {
        if (!features["tassel"]) {
            add = true;
        }
    }
    // Tassel restrictions
    if (feature === "tassel") {
        if (!features["keychain"]) {
            add = true;
        }
    }
     // Ribbon restrictions
    if (feature === "ribbon") {
        if (!features["butterfly"] && !features["flower"]) {
            add = true;
        }
    }
     // Butterfly restrictions
    if (feature === "butterfly") {
        if (!features["ribbon"] && !features["flower"]) {
            add = true;
        }
    }
     // Flower restrictions
    if (feature === "flower") {
        if (!features["ribbon"] && !features["butterfly"]) {
            add = true;
        }
    }

    return add;
}

// Add a feature to the preview
function addFeature(feature) {
    features[feature] = true;
    console.log("feature");
    document.getElementById(feature).classList.remove("hide");
    document.getElementById("feature_"+feature).classList.add("chosenFeature");
    selectedList.appendChild(createFeatureElement(feature));
    animationIn(feature);
}

// Delete a feature from the preview
function deleteFeature(feature) {
    features[feature] = false;
    document.getElementById("feature_"+feature).classList.remove("chosenFeature");
    document.getElementById(feature).classList.add("hide");
    animationOut(feature);
    setTimeout(function() {
        selectedList.removeChild(document.getElementById("selected_"+feature));
    }, 1000);
}

// Create an element for the selected features list
function createFeatureElement(feature) {
    const li = document.createElement("li");
    li.id = "selected_" + feature;

    const img = document.createElement("img");
    img.src = `assets/feature_${feature}.png`;

    li.append(img);
    return li;
}

// Animation to add a feature
function animationIn(feature) {
    const firstFrame = document.getElementById("image_"+feature).getBoundingClientRect();
    const lastFrame = document.getElementById("selected_"+feature).getBoundingClientRect();
    const deltaX = firstFrame.left - lastFrame.left;
    const deltaY = firstFrame.top - lastFrame.top;
    const deltaWidth = firstFrame.width / lastFrame.width;
    const deltaHeight = firstFrame.height / lastFrame.height;
    document.getElementById("selected_"+feature).animate(
      [
        {transformOrigin: "top left",
          transform: `translate(${deltaX}px, ${deltaY}px)
          scale(${deltaWidth}, ${deltaHeight})`
        },
        {transformOrigin: "top left",
          transform: 'none'
        }
      ],
      {duration:1000, easing: "ease-in", fill:"forwards"}
    );
}

// Animation to delete a feature
function animationOut(feature) {
    const firstFrame = document.getElementById("selected_"+feature).getBoundingClientRect();
    const lastFrame = document.getElementById("image_"+feature).getBoundingClientRect();
    const deltaX = lastFrame.left - firstFrame.left;
    const deltaY = lastFrame.top - firstFrame.top;                                            
    const deltaWidth = lastFrame.width / firstFrame.width;
    const deltaHeight =  lastFrame.height  / firstFrame.height;
    document.getElementById("selected_"+feature).animate(
        [
            {transformOrigin: "top left",
                transform: 'none'
            },
            {transformOrigin: "top left",
                transform: `translate(${deltaX}px, ${deltaY}px)
                scale(${deltaWidth}, ${deltaHeight})`
            }
        ],
        {duration:1000, easing: "ease-out"}
    );
}

