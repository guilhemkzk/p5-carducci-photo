let columns = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
};

// Get the container of the gallery of works
let galleryContainer = document.getElementById("gallery-container");

// Get a variable with all the images (HTML Collection)
let imagesInGallery = document.getElementsByClassName("gallery-item");

// General function to display the gallery
async function displayGallery(location) {
  // Display gallery
  location.style.display = "grid";
  // location.style.opacity = "1"; // Effet fade in via CSS sur 5 secondes
}

async function addBootstrapClasses(location, columns) {
  // Replace wrapItemInColumn
  // ==> add the classes in each image for bootstrap responsive design

  // Get a variable with all the images (HTML Collection) and convert it to an array
  // In order to use .map() on it

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
