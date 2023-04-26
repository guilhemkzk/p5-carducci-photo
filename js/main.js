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

//GENERAL VARIABLES

// Get the big container of the gallery of works
let galleryContainer = document.getElementById("gallery-container");

// Get the container for JUST the images
let rowGalleryContainer =
  document.getElementsByClassName("gallery-items-row")[0];

// Get a variable with all the images (HTML Collection)
let imagesInGallery = document.getElementsByClassName("gallery-item");

// Get the elements where the buttons are created just before and sent to HTML
let filterBtns = document.getElementsByClassName("nav-link");

// A VIRER
// Get the direct div parent that contains all the gallery images
let smallGalleryContainer =
  document.getElementsByClassName("gallery-items-row");

// DISPLAY THE GALLERY (function from gallery.js)
displayGallery(galleryContainer);

// ADD THE BOOTSRAP CLASSES SO THAT THE GALLERY IS RESPONSIVE (function from gallery.js)
addBootstrapClasses(rowGalleryContainer, columns);

// DISPLAY THE TAGS FOR FILTERING THE GALLERY (function from gallery.js)
displayAllTags(galleryContainer);

// ADD THE FILTERING LISTENERS (AND FUNCTION) ON THE FILTERING TAGS (function from gallery.js)
addFilteringFunction(filterBtns);

// ADD THE OPENLIGHTBOX LISTENERS (AND FUNCTION) OF THE IMAGES (function from gallery.js)
addListenerLightBox(imagesInGallery);
