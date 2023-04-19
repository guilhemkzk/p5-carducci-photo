// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ----------------------------- GENERAL FUNCTIONS --------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// When the user clicks anywhere outside of the modals, close it
window.onclick = function (event) {
  let modal = document.querySelector(".modal");
  if (event.target == modal) {
    modal.style.display = "none";
    //Unblock the scrolling when the modal is closed
    document.body.style.overflowY = "auto";
  }
};

// ADD event listener of the navigation buttons
document
  .querySelector(".mg-prev")
  .addEventListener("click", function (element) {
    // Input for the function : the HTML element for the img in the modal
    goToPrevImage(element.currentTarget.nextElementSibling);
  });

document
  .querySelector(".mg-next")
  .addEventListener("click", function (element) {
    // Input for the function : the HTML element for the img in the modal
    goToNextImage(element.currentTarget.previousElementSibling);
  });

// GLOBAL VARIABLE WITH THE FULL GALLERY IN ARRAY FORMAT

// Get a variable with all the images (HTML Collection) and convert it to an array
var allImagesInGallery = document.getElementsByClassName("gallery-item");
var allImagesGalleryArray = [];

for (let i = 0; i < allImagesInGallery.length; i++) {
  allImagesGalleryArray[i] = allImagesInGallery[i].outerHTML;
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------------- OPEN LIGHTBOX --------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function openLightBox(element, lightboxId, navigation) {
  // Get the lightBox HTML node
  let lightBox = document.querySelector(".modal");

  // Get the image on the modal
  let imageInModal = document.querySelector(".modal-content img");

  // Check for the value of lightBokId and navigation
  // IF lighboxId is not null ( the value has been defined)
  if (lightboxId !== null) {
    lightBox.attributes.id == lightboxId;
  }

  // IF navigation is not true, then not display the navigation arrows
  if (navigation !== true) {
    document.querySelector(".mg-prev").style.display = "none";
    document.querySelector(".mg-next").style.display = "none";
  }

  // Add the src element of the lightBox as the src attribute of the selected image
  imageInModal.src = element.src;

  //Display the modal
  lightBox.style.display = "flex";

  //Block the scrolling when the modal is open
  document.body.style.overflowY = "hidden";
}
// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------- NEXT & PREV IMAGE ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// FUNCTION TO GET THE POSITION OF AN IMAGE FROM ITS NAME IN A GALLERY ARRAY
async function getImagePosition(array, element) {
  // Get the file name
  let fileName = element.src.split("/").slice(-1).join("/");

  let positionCounter = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].includes(fileName)) {
      break;
    } else {
      // Position counter is the index of the current image in the total gallery
      positionCounter++;
    }
  }
  return positionCounter;
}

// FUNCTION TO GO TO THE NEXT IMAGE
async function goToNextImage(element) {
  // Get the position of the current image
  let currentPosition = await getImagePosition(allImagesGalleryArray, element);

  // Add + 1 to get to the next image
  let nextPosition = currentPosition + 1;

  // Check if this is the last image of the gallery
  if (nextPosition + 1 > allImagesGalleryArray.length) {
    nextPosition--;
  }

  //Call the open modal function with the next image
  openLightBox(allImagesInGallery.item(nextPosition), lightboxId, navigation);

  // Get the active tag if there is a filter
}

// FUNCTION TO GO TO THE PREV IMAGE
async function goToPrevImage(element) {
  // Get the position of the current image
  let currentPosition = await getImagePosition(allImagesGalleryArray, element);

  // Add + 1 to get to the next image
  let prevPosition = currentPosition - 1;

  // Check if this is the last image of the gallery
  if (prevPosition < 0) {
    prevPosition++;
  }

  //Call the open modal function with the next image
  openLightBox(allImagesInGallery.item(prevPosition), lightboxId, navigation);
}

// #endregion
