//INPUTS

let columns = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
};

let lightBox = true;
let lightboxId = "myAwesomeLightbox";
let showTags = true;
let tagsPosition = "top";

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------POPULATE GALLERY WITH IMAGES -------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Get the container of the gallery of works
let galleryContainer = document.getElementById("gallery-container");

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

// Get the elements where the buttons are created just before and sent to HTML
let filterBtns = document.getElementsByClassName("nav-link");

// console.log(filterBtns[1].attributes.tag.nodeValue);

//EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
for (let i = 0; i < filterBtns.length; i++) {
  //For each categorie

  filterBtns.item(i).addEventListener("click", function () {
    //Create an event listener for each button

    console.log(filterBtns[i].attributes.tag.nodeValue);
    // filterByTag(filterBtns[i]);
  });
}

async function tagsListeners() {}

//     // CREATING THE EVENT LISTENER FOR THE ALREADY EXISTING ALL BUTTON
//     // Get the button from the html
//     let allBtn = document.getElementById("btn-all");

//     // Autofocus on the ALL button
//     allBtn.focus();
//     allBtn.style.outline = "none";

//     //EVENT LISTENER FOR ALL BUTTON AND LOAD ALL WORKS
//     allBtn.addEventListener("click", function () {
//       //call function that get and display all works in the gallery, erasing what was before
//       getWorks(gallery);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

// getCategories(filterDiv);

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

  galleryItems.item(i).addEventListener("click", function () {
    //Create an event listener for each button

    console.log("Modale");
    // filterByTag(filterBtns[i]);
  });
}

async function tagsListeners() {}

// #endregion

// Function to add the img-fluid class to all IMG on the page
async function makeImagesResponsive(element) {
  if (element.getAttribute("tagName") === "IMG") {
    // si la propriété de l'élément ayant pour clé tagName est égale à IMG
    element.addClass("img-fluid"); // ajouter à l'élément une classe = img-fluid
  }
}
