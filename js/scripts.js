// IMPORT FUNCTIONS
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

// Get the big container of the gallery of works
let galleryContainer = document.getElementById("gallery-container");

// Get the container for JUST the images
let rowGalleryContainer =
  document.getElementsByClassName("gallery-items-row")[0];

// Get a variable with all the images (HTML Collection)
let imagesInGallery = document.getElementsByClassName("gallery-item");

// Get the elements where the buttons are created just before and sent to HTML
let filterBtns = document.getElementsByClassName("nav-link");

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------ GENERAL FUNCTIONS & VARIABLES -------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Building a constant that will contain all the informations about
// the images in the gallery, tags and positions

// Function to extract uniques values from an array
function onlyUnique(value, index, array) {
  // If the index of the firt occurence of a value == the index, then push
  // it to the new array
  return array.indexOf(value) === index;
}

// Function to calculate some variables and combine them in the constant
function initConstants() {
  // HTML Collection of all the images
  let allImagesInGallery = document.getElementsByClassName("gallery-item");
  // Array of all the images
  let allImagesGalleryArray = Array.prototype.slice.call(allImagesInGallery);
  // Array of all the tags for each image (the tags are at the same index as the
  // corresponding image)
  let allTagsGalleryArray = allImagesGalleryArray.map(
    (allImagesGalleryArray) => allImagesGalleryArray.dataset.tag
  );
  // Array with only uniques tags
  let uniquesTags = allTagsGalleryArray.filter(onlyUnique);

  // Calculate for an array regarding a given string (tag) the first and the
  // last indexes of this string in the array.
  const findFirstLast = (array, tag) => {
    return {
      first: array.indexOf(tag),
      last: array.lastIndexOf(tag),
    };
  };

  // Initiate object
  let positions = {};

  // Create an object that will contain the first and last occurences of
  // each tag iot remove navigation arrows later
  for (let i = 0; i < uniquesTags.length; i++) {
    // For each (unique) tag
    // Add to the object three values : Key (= the tag name), First (= the index
    // of the first occurence of the tag), Last (= the index of the last occurrence
    // of the tag)
    positions[uniquesTags[i]] = findFirstLast(
      allTagsGalleryArray,
      uniquesTags[i]
    );
  }

  // Manually adding the values for the tag 'Tous'
  positions["Tous"] = {
    first: 0,
    last: allImagesGalleryArray.length - 1,
  };

  // Building and returning the constant
  return {
    allImages: allImagesInGallery, // HTML Collection of images in gallery
    allImagesArr: allImagesGalleryArray, // Array of images in gallery
    allTags: allTagsGalleryArray, // Array with tags of the images
    tagsFirstLast: positions, // Object with the key as tags, first and last positions
    uniqueTags: uniquesTags, // array containing the list of unique tags
  };
}

// Create the constant
const IMAGE_GALLERY = initConstants();

// When the user clicks anywhere outside of the modals, close it
window.onclick = function (event) {
  let modal = document.querySelector(".modal");
  if (event.target == modal) {
    modal.style.display = "none";
    //Unblock the scrolling when the modal is closed
    document.body.style.overflowY = "auto";
  }
};

// Add event listener of the navigation arrows : previous arrow
document
  .querySelector(".mg-prev")
  .addEventListener("click", function (element) {
    // Input for the function : the HTML element for the image in the modal
    goToPrevImage(
      element.currentTarget.nextElementSibling,
      document.querySelector(".nav-link.active").dataset.tag, // Get active tag
      IMAGE_GALLERY
    );
  });

// Add event listener of the navigation arrows : next arrow
document
  .querySelector(".mg-next")
  .addEventListener("click", function (element) {
    // Input for the function : the HTML element for the image in the modal
    goToNextImage(
      element.currentTarget.previousElementSibling,
      document.querySelector(".nav-link.active").dataset.tag, // Get active tag
      IMAGE_GALLERY
    );
  });

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------------- OPEN LIGHTBOX --------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to open the light box (modal)
// Triggered by event listener on each image in gallery.js

async function openLightBox(element, lightboxId, navigation, IMAGE_GALLERY) {
  // Parameters :
  // element : the image that has been clicked on
  // lightboxId : string given in main.js
  // navigation : boolean given in main.js

  // Get the lightBox node
  let lightBox = document.querySelector(".modal");

  // Get the image on the modal
  let imageInModal = document.querySelector(".modal-content img");

  // Check for the value of lightBokId and navigation
  // If lighboxId is not null (the value has been defined), then take into account
  if (lightboxId !== null) lightBox.attributes.id == lightboxId;

  // Management of the nav arrows
  await getArrowsCorrectDisplay(navigation, element, IMAGE_GALLERY);

  //Change the src of the source to the forlder of the real image (no thumbnail)
  let newSrc = element.src.replace("/thumbnails", "/images");

  // Add the src element of the lightBox as the src attribute of the selected image
  imageInModal.src = newSrc;

  //Display the modal
  lightBox.style.display = "flex";

  //Block the scrolling when the modal is open
  document.body.style.overflowY = "hidden";
}
// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region -------------- GET THE NAVIGATION ARROWS CORRECT DISPLAY ------------------------ //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to manage the display of the nav arrows in all situations

async function getArrowsCorrectDisplay(navigation, element, IMAGE_GALLERY) {
  // Parameters :
  // navigation : boolean, in main.js
  // element : the current image displayed in the modal

  // Get the nav arrow nodes
  let prevArrow = document.querySelector(".mg-prev");
  let nextArrow = document.querySelector(".mg-next");

  // Get the position of the image in the gallery
  let imagePosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // If navigation is not true, then do not display the navigation arrows
  if (navigation !== true) {
    prevArrow.style.display = "none";
    nextArrow.style.display = "none";
  } else {
    // Else display the navigation arrows
    prevArrow.style.display = "flex";
    nextArrow.style.display = "flex";
  }

  // Get the active tag (from the class added to the active tag)
  let activeTag = document.querySelector(".nav-link.active").dataset.tag;

  if (imagePosition == IMAGE_GALLERY["tagsFirstLast"][activeTag]["first"])
    // If the image is the first one for the selected tag, then rm prev arrow
    prevArrow.style.display = "none";

  if (
    // If the image is the last one of the selected tag, then rm next arrow
    imagePosition == IMAGE_GALLERY["tagsFirstLast"][activeTag]["last"]
  )
    nextArrow.style.display = "none";
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------- NEXT & PREV IMAGE ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// Function to get the position of an image in the gallery (as an array)
async function getImagePosition(array, element) {
  // Parameters :
  // array : the array containing all the images of the gallery (from the gen constant)
  // element : the image that position must be found

  // Get the name of the image file (xxxxx.extension) from the object, as a string
  let fileName = element.src.split("/").slice(-1).join("/");

  // Initiate a counter
  let positionCounter = 0;

  // For each element in the array containing all the images of the gallery
  for (let i = 0; i < array.length; i++) {
    // If the element includes the file name, then break
    if (array[i].src.includes(fileName)) {
      break;
    } else {
      // Else, increase the position counter
      positionCounter++;
    }
  }
  return positionCounter;
}

// FUNCTION TO GO TO THE NEXT IMAGE
async function goToNextImage(element, tag, IMAGE_GALLERY) {
  // Parameters:
  // element : the current image
  // tag : the active tag

  // Get the position of the current image
  let currentPosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // // If this is the last image, then break
  // if (currentPosition == IMAGE_GALLERY.tagsFirstLast.Tous.last) return;

  // Initiate the nexPosition as the current position + 1
  let nextPosition = currentPosition;

  if (
    tag == "Tous" &&
    nextPosition !== IMAGE_GALLERY["tagsFirstLast"][tag]["last"]
  ) {
    // If the tag is "Tous" and this is not the last image add 1 to the position
    nextPosition = currentPosition + 1;
  } else if (tag !== "Tous") {
    // Starting at current position, going up to the last image, looking for
    // the first one that have the same tag as the active one
    for (j = currentPosition + 1; j < IMAGE_GALLERY.allImagesArr.length; j++) {
      if (IMAGE_GALLERY.allTags[j] == tag) {
        nextPosition = j;
        break;
      }
    }
  }
  //Call the open modal function with the next image
  openLightBox(
    IMAGE_GALLERY.allImages.item(nextPosition),
    lightboxId,
    navigation,
    IMAGE_GALLERY
  );
}

// Function to go the previous image
async function goToPrevImage(element, tag, IMAGE_GALLERY) {
  // Parameters:
  // element : the current image
  // tag : the active tag

  // Get the position of the current image
  let currentPosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // If this is the first image, then do nothing
  if (currentPosition == 0) {
    return;
  } else {
    // Else, initiate the previous position as the current one
    let prevPosition = currentPosition;

    if (
      tag == "Tous" &&
      prevPosition !== IMAGE_GALLERY["tagsFirstLast"][tag]["first"]
    ) {
      // If the tag is "Tous" and this is not the first image, rm 1 to the position
      prevPosition = currentPosition - 1;
    } else if (tag !== "Tous") {
      // Starting at current position, going down to the first image, looking for
      // the first one that have the same tag as the active one
      for (j = currentPosition - 1; j >= 0; j--) {
        if (IMAGE_GALLERY.allTags[j] == tag) {
          prevPosition = j;
          break;
        }
      }
    }

    //Call the open modal function with the next image
    openLightBox(
      IMAGE_GALLERY.allImages.item(prevPosition),
      lightboxId,
      navigation,
      IMAGE_GALLERY
    );
  }
}

// #endregion

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
    '<ul class="my-4 tags-bar nav nav-pills" role="tablist"><li class="nav-item active" role="tab"><span class="nav-link active" data-tag="Tous" aria-selected="true" tabindex="0" aria-label="Afficher toutes les images">Tous</span></li>' +
    tagsCollectionArray
      .map(
        (tagsCollectionArray) => `
      <li class="nav-item" role="tab">
      <span class="nav-link" aria-selected="false" tabindex="0"data-tag="${tagsCollectionArray}" aria-label="Afficher les images ${tagsCollectionArray}">${tagsCollectionArray}</span></li>`
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

  // Get all the tags and change aria selected true value to false
  document.querySelector(".nav-link.active").ariaSelected = "false";
  // Get all the tags and remove all previous active classes
  document.querySelector(".nav-link.active").classList.remove("active");

  // Get the present tag and add the active class to it
  document
    .querySelector(`span[data-tag="${selectedTag}"]`)
    .classList.add("active");
  // Get the present tag and add the aria selected true to it
  document.querySelector(`span[data-tag="${selectedTag}"]`).ariaSelected =
    "true";

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

// DISPLAY THE GALLERY (function from gallery.js)
displayGallery(galleryContainer);

// ADD THE BOOTSRAP CLASSES SO THAT THE GALLERY IS RESPONSIVE (function from gallery.js)
addBootstrapClasses(rowGalleryContainer, columns);

// DISPLAY THE TAGS FOR FILTERING THE GALLERY (function from gallery.js)
displayAllTags(galleryContainer, showTags, IMAGE_GALLERY);

// ADD THE FILTERING LISTENERS (AND FUNCTION) ON THE FILTERING TAGS (function from gallery.js)
addFilteringFunction(filterBtns);

// ADD THE OPENLIGHTBOX LISTENERS (AND FUNCTION) OF THE IMAGES (function from gallery.js)
addListenerLightBox(imagesInGallery);
