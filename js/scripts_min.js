let columns = 3,
  lightBox = !0,
  lightboxId = null,
  showTags = !0,
  tagsPosition = "bottom",
  navigation = !0;
(columns = { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }),
  (lightBox = !0),
  (lightboxId = "myAwesomeLightbox"),
  (showTags = !0),
  (tagsPosition = "top");
let galleryContainer = document.getElementById("gallery-container"),
  rowGalleryContainer = document.getElementsByClassName("gallery-items-row")[0],
  imagesInGallery = document.getElementsByClassName("gallery-item"),
  filterBtns = document.getElementsByClassName("nav-link");
function onlyUnique(e, t, a) {
  return a.indexOf(e) === t;
}
function initConstants() {
  let e = document.getElementsByClassName("gallery-item"),
    t = Array.prototype.slice.call(e),
    a = t.map((e) => e.dataset.tag),
    l = a.filter(onlyUnique),
    s = (e, t) => ({ first: e.indexOf(t), last: e.lastIndexOf(t) }),
    i = {};
  for (let n = 0; n < l.length; n++) i[l[n]] = s(a, l[n]);
  return (
    (i.Tous = { first: 0, last: t.length - 1 }),
    {
      allImages: e,
      allImagesArr: t,
      allTags: a,
      tagsFirstLast: i,
      uniqueTags: l,
    }
  );
}
const IMAGE_GALLERY = initConstants();
async function openLightBox(e, t, a, l) {
  let s = document.querySelector(".modal"),
    i = document.querySelector(".modal-content img");
  null !== t && s.attributes.id, await getArrowsCorrectDisplay(a, e, l);
  let n = e.src.replace("/thumbnails", "/images");
  (i.src = n),
    (s.style.display = "flex"),
    (document.body.style.overflowY = "hidden");
}
async function getArrowsCorrectDisplay(e, t, a) {
  let l = document.querySelector(".mg-prev"),
    s = document.querySelector(".mg-next"),
    i = await getImagePosition(a.allImagesArr, t);
  !0 !== e
    ? ((l.style.display = "none"), (s.style.display = "none"))
    : ((l.style.display = "flex"), (s.style.display = "flex"));
  let n = document.querySelector(".nav-link.active").dataset.tag;
  i == a.tagsFirstLast[n].first && (l.style.display = "none"),
    i == a.tagsFirstLast[n].last && (s.style.display = "none");
}
async function getImagePosition(e, t) {
  let a = t.src.split("/").slice(-1).join("/"),
    l = 0;
  for (let s = 0; s < e.length && !e[s].src.includes(a); s++) l++;
  return l;
}
async function goToNextImage(e, t, a) {
  let l = await getImagePosition(a.allImagesArr, e),
    s = l;
  if ("Tous" == t && s !== a.tagsFirstLast[t].last) s = l + 1;
  else if ("Tous" !== t) {
    for (j = l + 1; j < a.allImagesArr.length; j++)
      if (a.allTags[j] == t) {
        s = j;
        break;
      }
  }
  openLightBox(a.allImages.item(s), lightboxId, navigation, a);
}
async function goToPrevImage(e, t, a) {
  let l = await getImagePosition(a.allImagesArr, e);
  if (0 != l) {
    let s = l;
    if ("Tous" == t && s !== a.tagsFirstLast[t].first) s = l - 1;
    else if ("Tous" !== t) {
      for (j = l - 1; j >= 0; j--)
        if (a.allTags[j] == t) {
          s = j;
          break;
        }
    }
    openLightBox(a.allImages.item(s), lightboxId, navigation, a);
  }
}
function displayGallery(e) {
  e.style.display = "grid";
}
function addBootstrapClasses(e, t) {
  let a = document.getElementsByClassName("gallery-item"),
    l = [];
  for (let s = 0; s < a.length; s++) l[s] = a[s].outerHTML;
  if ("number" == typeof t && null !== t)
    e.appendChild(
      `<div class='item-column mb-4 col-${Math.ceil(12 / t)}'></div>`
    );
  else if ("object" == typeof t && null !== t) {
    var i = "";
    for (let n in t)
      "xs" !== n
        ? (i += ` col-${n}-${Math.ceil(12 / t[n])}`)
        : "xs" == n && (i += ` col-${Math.ceil(12 / t[n])}`);
    let o =
      l
        .map(
          (e) => `
    
                    <div class='item-column mb-4${i}'>${e}</div>`
        )
        .join("") + "</div>";
    e.innerHTML = o;
  } else
    console.error(
      `Columns should be defined as numbers or objects. ${typeof t} is not supported.`
    );
}
function displayAllTags(e, t, a) {
  let l = a.uniqueTags,
    s =
      '<ul class="my-4 tags-bar nav nav-pills" role="tablist"><li class="nav-item active" role="tab"><span class="nav-link active" data-tag="Tous" aria-selected="true" tabindex="0" aria-label="Afficher toutes les images">Tous</span></li>' +
      l
        .map(
          (e) => `
      <li class="nav-item" role="tab">
      <span class="nav-link" aria-selected="false" tabindex="0"data-tag="${e}" aria-label="Afficher les images ${e}">${e}</span></li>`
        )
        .join("") +
      "</ul>";
  t &&
    ("bottom" === tagsPosition
      ? e.insertAdjacentHTML("beforeend", s)
      : "top" === tagsPosition
      ? e.insertAdjacentHTML("afterbegin", s)
      : console.error(`Unknown tags position: ${tagsPosition}`));
}
function removeAnimation(e) {
  e.classList.value.includes("gallery-animate") &&
    (e.classList.remove("gallery-animate"), e.offsetWidth);
}
function launchAnimation(e) {
  e.classList.add("gallery-animate");
}
function addFilteringFunction(e) {
  for (let t = 0; t < e.length; t++)
    e.item(t).addEventListener("click", function () {
      let a = e[t].dataset.tag;
      removeAnimation(document.getElementsByClassName("gallery-items-row")[0]),
        filterImages(a);
    });
}
function filterImages(e) {
  let t = document.getElementsByClassName("item-column");
  for (let a of ((document.querySelector(".nav-link.active").ariaSelected =
    "false"),
  document.querySelector(".nav-link.active").classList.remove("active"),
  document.querySelector(`span[data-tag="${e}"]`).classList.add("active"),
  (document.querySelector(`span[data-tag="${e}"]`).ariaSelected = "true"),
  t))
    "Tous" !== e
      ? a.firstChild.dataset.tag == e
        ? (a.style.display = "flex")
        : a.firstChild.dataset.tag !== e && (a.style.display = "none")
      : (a.style.display = "flex");
  launchAnimation(document.getElementsByClassName("gallery-items-row")[0]);
}
function addListenerLightBox(e) {
  for (let t = 0; t < e.length; t++)
    e.item(t).addEventListener("click", function (e) {
      openLightBox(e.currentTarget, lightboxId, navigation, IMAGE_GALLERY);
    });
}
(window.onclick = function (e) {
  let t = document.querySelector(".modal");
  e.target == t &&
    ((t.style.display = "none"), (document.body.style.overflowY = "auto"));
}),
  document.querySelector(".mg-prev").addEventListener("click", function (e) {
    goToPrevImage(
      e.currentTarget.nextElementSibling,
      document.querySelector(".nav-link.active").dataset.tag,
      IMAGE_GALLERY
    );
  }),
  document.querySelector(".mg-next").addEventListener("click", function (e) {
    goToNextImage(
      e.currentTarget.previousElementSibling,
      document.querySelector(".nav-link.active").dataset.tag,
      IMAGE_GALLERY
    );
  }),
  displayGallery(galleryContainer),
  addBootstrapClasses(rowGalleryContainer, columns),
  displayAllTags(galleryContainer, showTags, IMAGE_GALLERY),
  addFilteringFunction(filterBtns),
  addListenerLightBox(imagesInGallery);
