// DEFAULT INPUTS

let columns = 3;
let lightBox = true;
let lightboxId = null;
let showTags = true;
let tagsPosition = "bottom";
let navigation = true;

//INPUTS

columns = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
};

lightBox = true;
lightboxId = "myAwesomeLightbox";
showTags = true;
tagsPosition = "top";

//GENERAL VARIABLES

// Get the container of the gallery of works
let galleryContainer = document.getElementById("gallery-container");

// Get a variable with all the images (HTML Collection)
let imagesInGallery = document.getElementsByClassName("gallery-item");

// Get the elements where the buttons are created just before and sent to HTML
let filterBtns = document.getElementsByClassName("nav-link");

// Get the direct div parent that contains all the gallery images
let smallGalleryContainer =
  document.getElementsByClassName("gallery-items-row");

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------POPULATE GALLERY WITH IMAGES -------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to display the gallery
async function displayGallery(location) {
  // Display gallery
  location.style.display = "grid";
  // location.style.opacity = "1"; // Effet fade in via CSS sur 5 secondes
}

// General function to add the Bootstrap classes to the images
async function addBootstrapClasses(location, columns) {
  // Replace wrapItemInColumn
  // ==> add the classes in each image for bootstrap responsive design

  // Get a variable with all the images (HTML Collection) and convert it to an array
  let imagesInGallery = document.getElementsByClassName("gallery-item");
  let imagesInGalleryArray = [];

  for (let i = 0; i < imagesInGallery.length; i++) {
    imagesInGalleryArray[i] = imagesInGallery[i].outerHTML;
  }

  // IF columns is a number ==> should not happen
  if (typeof columns === "number" && columns !== null) {
    location.appendChild(
      `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
    );
    // ELSE IF => should happen
  } else if (typeof columns === "object" && columns !== null) {
    var columnClasses = ""; // Initiate the variable as an empty string

    for (const key in columns) {
      if (key !== "xs") {
        // Non regular case for xs where {key is not added}
        columnClasses += ` col-${key}-${Math.ceil(12 / columns[key])}`;
      } else if (key == "xs") {
        columnClasses += ` col-${Math.ceil(12 / columns[key])}`;
      }
    }

    // Add the <div> around
    const returnImages =
      '<div class="gallery-items-row row">' +
      imagesInGalleryArray
        .map(
          (imagesInGalleryArray) => `

                <div class='item-column mb-4${columnClasses}'>${imagesInGalleryArray}</div>`
        )
        .join("") +
      "</div>";

    // Send the content written in the HTML page (errasing what was written previously)
    location.innerHTML = returnImages;
  } else {
    console.error(
      `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
    );
  }
}

displayGallery(galleryContainer);
addBootstrapClasses(galleryContainer, columns);

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Quel intérêt ?

//Add the bootstrap responsive class to all the pictures
for (let i = 0; i < imagesInGallery.length; i++) {
  //For each categorie
  if (imagesInGallery.item(i).nodeName === "IMG") {
    // si la propriété de l'élément ayant pour clé tagName est égale à IMG
    imagesInGallery.item(i).classList.add("img-fluid"); // ajouter à l'élément une classe = img-fluid
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------CREATING THE FILTERING TAGS --------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to get all the tags from HTML images
async function displayAllTags(location) {
  //
  // GET THE TAGS FROM THE HTML
  //

  // Initiate the variables
  let tagsCollection = [];

  // Get a variable with all the images (HTML Collection)
  let imagesInGallery = document.getElementsByClassName("gallery-item");

  // Iterate on imagesInGallery to get all the tags
  let counter = 0;
  for (let i = 0; i < imagesInGallery.length; i++) {
    if (!tagsCollection.includes(imagesInGallery[i].attributes.tag.nodeValue)) {
      tagsCollection[counter] = imagesInGallery[i].attributes.tag.nodeValue;
      counter++;
    }
  }

  //Add the "tous" tag at the begining of the array
  tagsCollection.unshift("Tous"); // TYPE = OBJECT

  //
  // DISPLAY THE TAGS IN A LIST
  //

  // Turn tagsCollection to an array
  let tagsCollectionArray = [];

  for (let i = 0; i < tagsCollection.length; i++) {
    tagsCollectionArray[i] = tagsCollection[i];
  }

  const returnTagList =
    '<ul class="my-4 tags-bar nav nav-pills">' +
    tagsCollectionArray
      .map(
        (tagsCollectionArray) => `
  <li class="nav-item active">
  <span class="nav-link"  tag="${tagsCollectionArray}">${tagsCollectionArray}</span></li>`
      )
      .join("") +
    "</ul>";

  if (showTags) {
    // IF the position (defined by user) is BOTTOM, display at the bottom
    if (tagsPosition === "bottom") {
      location.insertAdjacentHTML("beforeend", returnTagList); // on ajoute la liste des tags après la gallerie
    } else if (tagsPosition === "top") {
      // IF the position is TOP
      location.insertAdjacentHTML("afterbegin", returnTagList); // on ajoute la liste des tags avant la gallerie
    } else {
      console.error(`Unknown tags position: ${tagsPosition}`); // sinon on renvoie une erreur
    }
  }
}

displayAllTags(galleryContainer);

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD TAGS LISTENERS ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to hide elements
async function hide(elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = "none";
  }
}

// Function to display elements
async function unhide(elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = "flex";
  }
}

// console.log(filterBtns[1].attributes.tag.nodeValue);

//EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
for (let i = 0; i < filterBtns.length; i++) {
  //For each categorie

  filterBtns.item(i).addEventListener("click", function () {
    // Get the tag of the button clicked
    let selectedTag = filterBtns[i].attributes.tag.nodeValue;

    // Filter the tags
    filterImages(selectedTag);
  });
}

async function filterImages(selectedTag) {
  // Get a variable with all the images (HTML Collection) and convert it to an array
  let imagesInGallery = document.getElementsByClassName("gallery-item");
  let imagesInGalleryArray = [];

  // Loop in the imagesInGallery to hide the ones that does not match the tag
  // For each item in the HTML collection, check if the tag correspond to the
  // selected one => if so, display it ; if not, hide it.
  for (let item of imagesInGallery) {
    if (selectedTag !== "Tous") {
      if (item.attributes.tag.nodeValue == selectedTag) {
        item.style.display = "flex"; // if the tag matches, then display
      } else if (item.attributes.tag.nodeValue !== selectedTag) {
        item.style.display = "none"; // if the tag matches, then display
      }
    } else {
      item.style.display = "flex";
    }
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ CREATE LIGHTBOX ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Create Light Box
// Create and insert all the div containing the lightBox, hidden by default
async function createLightBox(location, lightboxId, navigation) {
  let modaleCorps = `<div class="modal fade" id="${
    lightboxId ? lightboxId : "galleryLightbox"
  } " tabindex="-1" role="dialog">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-body">
            ${
              navigation
                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                : '<span style="display:none;" />'
            }
            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
            ${
              navigation
                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                : '<span style="display:none;" />'
            }
        </div>
    </div>
</div>
</div>`;

  location.insertAdjacentHTML("afterbegin", modaleCorps);
}

createLightBox(galleryContainer, lightboxId, navigation);

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD IMAGE LISTENERS ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Get the elements where the buttons are created just before and sent to HTML
let galleryItems = document.getElementsByClassName("gallery-item");

// console.log(filterBtns[1].attributes.tag.nodeValue);

//EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
for (let i = 0; i < galleryItems.length; i++) {
  //For each categorie

  galleryItems.item(i).addEventListener("click", function (element) {
    //Create an event listener for each button
    openLightBox(element.currentTarget, lightboxId);
  });
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ OPEN LIGHTBOX ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function openLightBox(element, lightboxId) {
  // Get the lightBox HTML node
  let lightBox = document.getElementById(lightboxId);

  // Add the src element of the lightBox as the src attribute of the selected image
  lightBox.src = element.src;

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  lightBox.modal("toggle");
}
// #endregion
