// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------POPULATE GALLERY WITH IMAGES -------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to display the gallery
function displayGallery(location) {
  // Display gallery
  location.style.display = "grid";
}

// General function to add the Bootstrap classes to the images for responsive
function addBootstrapClasses(location, columns) {
  // Parameters:
  // location : parent node containing the images
  // columns : number, in main.js

  // Get the images as an HTML collection
  let imagesInGallery = document.getElementsByClassName("gallery-item");
  // Initiate array
  let imagesInGalleryArray = [];

  // Convert the gallery as an array of strings
  for (let i = 0; i < imagesInGallery.length; i++) {
    imagesInGalleryArray[i] = imagesInGallery[i].outerHTML;
  }

  // Build the css classes using the defined value of "number" in main.js
  // to determine the number of columns for each screen size

  // If columns is a number (by default)
  if (typeof columns === "number" && columns !== null) {
    location.appendChild(
      `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
    );
    // Else, if column is an object (as it should)
  } else if (typeof columns === "object" && columns !== null) {
    // Initiate the variable as an empty string
    var columnClasses = "";

    // for each key in the object columns
    // where each key correspond to a given bootstrap size
    for (const key in columns) {
      if (key !== "xs") {
        // Non regular case for xs where {key is not added}
        // Build the expression with the values in columns
        columnClasses += ` col-${key}-${Math.ceil(12 / columns[key])}`;
      } else if (key == "xs") {
        columnClasses += ` col-${Math.ceil(12 / columns[key])}`;
      }
    }

    // Add the <div> around the built expression using map() function
    const returnImages =
      imagesInGalleryArray
        .map(
          (imagesInGalleryArray) => `
  
                  <div class='item-column mb-4${columnClasses}'>${imagesInGalleryArray}</div>`
        )
        .join("") + "</div>";

    // Send the content written in the HTML page
    location.innerHTML = returnImages;
  } else {
    console.error(
      `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
    );
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------CREATING THE FILTERING TAGS --------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to display all the tags from HTML images
function displayAllTags(location, showTags, IMAGE_GALLERY) {
  // Parameters:
  // location : parent div where the list of tag will be added
  // showTags : string, in main.js

  // Get the tag unique values from the constant
  let tagsCollectionArray = IMAGE_GALLERY.uniqueTags;

  // Build the hmtl list of the tags as it will be displayed using map() function
  const returnTagList =
    '<ul class="my-4 tags-bar nav nav-pills"><li class="nav-item active"><span class="nav-link active" data-tag="Tous">Tous</span></li>' +
    tagsCollectionArray
      .map(
        (tagsCollectionArray) => `
    <li class="nav-item">
    <span class="nav-link" data-tag="${tagsCollectionArray}">${tagsCollectionArray}</span></li>`
      )
      .join("") +
    "</ul>";

  if (showTags) {
    // If the value is "bottom", display at the bottom
    if (tagsPosition === "bottom") {
      // The list of tags is added after the image gallery
      location.insertAdjacentHTML("beforeend", returnTagList);
    } else if (tagsPosition === "top") {
      // IF the position is top
      location.insertAdjacentHTML("afterbegin", returnTagList);
      // The list of tags is added before the image gallery
    } else {
      console.error(`Unknown tags position: ${tagsPosition}`);
    }
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ---------------------------- MANAGEMENT OF ANIMATION ---------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to remove the animation class
function removeAnimation(container) {
  // If the div already contains the class gallery-animate, then remove it
  if (container.classList.value.includes("gallery-animate")) {
    // Remove it
    container.classList.remove("gallery-animate");
    // Source : https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/
    // Void : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void

    // Trigger the DOM reflow in order to restart animation when the class is added later
    void container.offsetWidth;
  }
}

// Function to add the animation class
function launchAnimation(container) {
  container.classList.add("gallery-animate");
}
// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD TAGS LISTENERS ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to add the event listeners to eact filter btn
function addFilteringFunction(filterBtns) {
  //EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
  for (let i = 0; i < filterBtns.length; i++) {
    //For each categorie

    filterBtns.item(i).addEventListener("click", function () {
      // Get the tag of the button clicked
      let selectedTag = filterBtns[i].dataset.tag;

      // Remove animation class if applicable
      removeAnimation(document.getElementsByClassName("gallery-items-row")[0]);
      // Filter the tags
      filterImages(selectedTag);
    });
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------- FUNCTION TO FILTER GALLERY ---------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to filter the gallery of images regarding the selected tag
function filterImages(selectedTag) {
  // Get a variable with all the images (HTML Collection) and convert it to an array
  let individualsImagesContainers =
    document.getElementsByClassName("item-column");

  // Get all the tags and remove all previous active classes
  document.querySelector(".nav-link.active").classList.remove("active");

  // Get the present tag and add the active class to it
  document
    .querySelector(`span[data-tag="${selectedTag}"]`)
    .classList.add("active");

  // Loop in the imagesInGallery to hide the ones that does not match the tag
  for (let item of individualsImagesContainers) {
    // For each item in the HTML collection, check if the tag correspond to the
    // selected one => if so, display it ; if not, hide it.
    if (selectedTag !== "Tous") {
      if (item.firstChild.dataset.tag == selectedTag) {
        item.style.display = "flex"; // if the tag matches, then display
      } else if (item.firstChild.dataset.tag !== selectedTag) {
        item.style.display = "none"; // if the tag matches, then display
      }
    } else {
      item.style.display = "flex";
    }
  }

  // Get the smaller containter of the images to start the animation again
  launchAnimation(document.getElementsByClassName("gallery-items-row")[0]);
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD IMAGE LISTENERS ------------------------------ //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to add event listener to the images to open the light box
function addListenerLightBox(galleryItems) {
  //For each image, add an event listener opening the modal for this image
  for (let i = 0; i < galleryItems.length; i++) {
    //For each item = image
    galleryItems.item(i).addEventListener("click", function (element) {
      // Create an event listener for each image (function is in lightbox.js)
      openLightBox(
        element.currentTarget,
        lightboxId,
        navigation,
        IMAGE_GALLERY
      );
    });
  }
}

// #endregion
