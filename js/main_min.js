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
function onlyUnique(e, t, l) {
  return l.indexOf(e) === t;
}
function initConstants() {
  let e = document.getElementsByClassName("gallery-item"),
    t = Array.prototype.slice.call(e),
    l = t.map((e) => e.dataset.tag),
    a = l.filter(onlyUnique),
    s = (e, t) => ({ first: e.indexOf(t), last: e.lastIndexOf(t) }),
    i = {};
  for (let n = 0; n < a.length; n++) i[a[n]] = s(l, a[n]);
  return (
    (i.Tous = { first: 0, last: t.length - 1 }),
    {
      allImages: e,
      allImagesArr: t,
      allTags: l,
      tagsFirstLast: i,
      uniqueTags: a,
    }
  );
}
const IMAGE_GALLERY = initConstants();
async function openLightBox(e, t, l, a) {
  let s = document.querySelector(".modal"),
    i = document.querySelector(".modal-content img");
  null !== t && s.attributes.id, await getArrowsCorrectDisplay(l, e, a);
  let n = e.src.replace("/thumbnails", "/images");
  (i.src = n),
    (s.style.display = "flex"),
    (document.body.style.overflowY = "hidden");
}
async function getArrowsCorrectDisplay(e, t, l) {
  let a = document.querySelector(".mg-prev"),
    s = document.querySelector(".mg-next"),
    i = await getImagePosition(l.allImagesArr, t);
  !0 !== e
    ? ((a.style.display = "none"), (s.style.display = "none"))
    : ((a.style.display = "flex"), (s.style.display = "flex"));
  let n = document.querySelector(".nav-link.active").dataset.tag;
  i == l.tagsFirstLast[n].first && (a.style.display = "none"),
    i == l.tagsFirstLast[n].last && (s.style.display = "none");
}
async function getImagePosition(e, t) {
  let l = t.src.split("/").slice(-1).join("/"),
    a = 0;
  for (let s = 0; s < e.length && !e[s].src.includes(l); s++) a++;
  return a;
}
async function goToNextImage(e, t, l) {
  let a = await getImagePosition(l.allImagesArr, e),
    s = a;
  if ("Tous" == t && s !== l.tagsFirstLast[t].last) s = a + 1;
  else if ("Tous" !== t) {
    for (j = a + 1; j < l.allImagesArr.length; j++)
      if (l.allTags[j] == t) {
        s = j;
        break;
      }
  }
  openLightBox(l.allImages.item(s), lightboxId, navigation, l);
}
async function goToPrevImage(e, t, l) {
  let a = await getImagePosition(l.allImagesArr, e);
  if (0 != a) {
    let s = a;
    if ("Tous" == t && s !== l.tagsFirstLast[t].first) s = a - 1;
    else if ("Tous" !== t) {
      for (j = a - 1; j >= 0; j--)
        if (l.allTags[j] == t) {
          s = j;
          break;
        }
    }
    openLightBox(l.allImages.item(s), lightboxId, navigation, l);
  }
}
function displayGallery(e) {
  e.style.display = "grid";
}
function addBootstrapClasses(e, t) {
  let l = document.getElementsByClassName("gallery-item"),
    a = [];
  for (let s = 0; s < l.length; s++) a[s] = l[s].outerHTML;
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
      a
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
function displayAllTags(e, t, l) {
  let a = l.uniqueTags,
    s =
      '<ul class="my-4 tags-bar nav nav-pills"><li class="nav-item active"><span class="nav-link active" data-tag="Tous">Tous</span></li>' +
      a
        .map(
          (e) => `
      <li class="nav-item">
      <span class="nav-link" data-tag="${e}">${e}</span></li>`
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
      let l = e[t].dataset.tag;
      removeAnimation(document.getElementsByClassName("gallery-items-row")[0]),
        filterImages(l);
    });
}
function filterImages(e) {
  let t = document.getElementsByClassName("item-column");
  for (let l of (document
    .querySelector(".nav-link.active")
    .classList.remove("active"),
  document.querySelector(`span[data-tag="${e}"]`).classList.add("active"),
  t))
    "Tous" !== e
      ? l.firstChild.dataset.tag == e
        ? (l.style.display = "flex")
        : l.firstChild.dataset.tag !== e && (l.style.display = "none")
      : (l.style.display = "flex");
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
