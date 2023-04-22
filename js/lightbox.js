// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------ GENERAL FUNCTIONS & VARIABLES--------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// GENERAL CONSTANT WITH THE FULL GALLERY IN HTML COLLECTION, ARRAY, AND TAG-ARRAY FORMATS

function calcConstants() {
  // Get a variable with all the images (HTML Collection) and convert it to an array
  let allImagesInGallery = document.getElementsByClassName("gallery-item");
  let allImagesGalleryArray = Array.prototype.slice.call(allImagesInGallery);

  return {
    allImages: allImagesInGallery, //HTML Collection
    allImagesArr: allImagesGalleryArray, // ARRAY
    allTags: allImagesGalleryArray.map(
      (allImagesGalleryArray) => allImagesGalleryArray.dataset.tag
    ), // ARRAY WITH POSITIONS
  };
}

const IMAGE_GALLERY = calcConstants();

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
    goToPrevImage(
      element.currentTarget.nextElementSibling,
      getActiveTag(),
      IMAGE_GALLERY
    );
  });

document
  .querySelector(".mg-next")
  .addEventListener("click", function (element) {
    // Input for the function : the HTML element for the img in the modal
    goToNextImage(
      element.currentTarget.previousElementSibling,
      getActiveTag(),
      IMAGE_GALLERY
    );
  });

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------------- OPEN LIGHTBOX --------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function openLightBox(element, lightboxId, navigation, IMAGE_GALLERY) {
  // Get the lightBox HTML node

  let lightBox = document.querySelector(".modal");

  // Get the image on the modal
  let imageInModal = document.querySelector(".modal-content img");

  // Check for the value of lightBokId and navigation
  // IF lighboxId is not null ( the value has been defined)
  if (lightboxId !== null) {
    lightBox.attributes.id == lightboxId;
  }

  getArrowsCorrectDisplay(navigation, element, IMAGE_GALLERY);

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
// #region -------------- GET THE NAVIGATION ARROWS CORRECT DISPLAY ------------------------ //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function getArrowsCorrectDisplay(navigation, element, IMAGE_GALLERY) {
  // Get the arrow for navigation
  let prevArrow = document.querySelector(".mg-prev");
  let nextArrow = document.querySelector(".mg-next");

  // Get the position of the image in the gallery
  let imagePosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // IF navigation is not true, then do not display the navigation arrows
  if (navigation !== true) {
    prevArrow.style.display = "none";
    nextArrow.style.display = "none";
  } else {
    // ELSE display the navigation arrows
    prevArrow.style.display = "flex";
    nextArrow.style.display = "flex";
  }
  // THEN IF the active tag is TOUS
  // AND it is the last of the first image, remove one of the arrows

  let activeTag = getActiveTag();

  if (activeTag == "Tous" && imagePosition == 0) {
    // First image => remove the left (prev) arrow
    prevArrow.style.display = "none";
  } else if (
    activeTag == "Tous" &&
    imagePosition == IMAGE_GALLERY.allImagesArr.length - 1
  ) {
    // Last image => remove the right arrow
    nextArrow.style.display = "none";
  }
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
    if (array[i].src.includes(fileName)) {
      break;
    } else {
      // Position counter is the index of the current image in the total gallery
      positionCounter++;
    }
  }
  return positionCounter;
}

// FUNCTION TO GO TO THE NEXT IMAGE
async function goToNextImage(element, tag, IMAGE_GALLERY) {
  // Get the position of the current image

  let currentPosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // IF THIS IS THE LAST IMAGE, THEN DO NOTHING

  if (currentPosition == IMAGE_GALLERY.allImagesArr.length) {
    return;
  } else {
    let nextPosition = currentPosition;

    if (tag == "Tous") {
      // Add + 1 to get to the next image
      nextPosition = currentPosition + 1;

      // Check if this is the last image of the gallery
      if (nextPosition + 1 > IMAGE_GALLERY.allImagesArr.length) {
        nextPosition--;
      }
    } else {
      // Starting at current position, going up to the last image, looking for
      // the first one that have the same tag as the active one
      for (
        j = currentPosition + 1;
        j < IMAGE_GALLERY.allImagesArr.length;
        j++
      ) {
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
}

// FUNCTION TO GO TO THE PREV IMAGE
async function goToPrevImage(element, tag, IMAGE_GALLERY) {
  // Get the position of the current image
  let currentPosition = await getImagePosition(
    IMAGE_GALLERY.allImagesArr,
    element
  );

  // IF THIS IS THE FIRST IMAGE, THEN DO NOTHING

  if (currentPosition == 0) {
    return;
  } else {
    let prevPosition = currentPosition;

    if (tag == "Tous") {
      // Add + 1 to get to the next image
      prevPosition = currentPosition - 1;

      // Check if this is the last image of the gallery
      if (prevPosition < 0) {
        // Stay to the current position
        prevPosition++;
      }
    } else {
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
