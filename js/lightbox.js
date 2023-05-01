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

  //Change the src to the source of the real image (no thumbnail)
  let newSrc = element.src.replace("-thumbnail", "");

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

  // Get the name of the image file (xxxxx.jpg) from the object, as a string
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
