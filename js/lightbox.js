// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ OPEN LIGHTBOX ------------------------------- //
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
    // document.querySelectorAll(".modal-body span").style.display = "flex";
  }

  // Add the src element of the lightBox as the src attribute of the selected image
  imageInModal.src = element.src;

  lightBox.style.display = "flex";
}
// #endregion

// When the user clicks anywhere outside of the modals, close it
window.onclick = function (event) {
  let modal = document.querySelector(".modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
