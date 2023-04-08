(function ($) {
  // L'élément mauGallery (dérivé de la bibliothèque jQuery) est une fonction qui prend en entrée la variable options
  $.fn.mauGallery = function (options) {
    // la variable option étend les constructeurs par défaut de mauGallery et peut donc s'appeler en faisant mauGallery.xxxx ?)
    var options = $.extend($.fn.mauGallery.defaults, options);

    // option contient donc : columns (qui contient lui-même plusieurs valeurs xs, sm...), lightBox, lightBoxId, showTags, tagsPosition)
    // + les autres méthodes par défaut (comme la taille, ect...)

    var tagsCollection = [];
    // Pour chaque élément (?) fait ces X choses contenues dans la fonction :
    return this.each(function () {
      // 1. Méthode createRowWrappers de mauGallery sur l'élément this (chaque élément ?) :
      // Méthode qui créé la div qui contient les rows comme élément enfant de this
      $.fn.mauGallery.methods.createRowWrapper($(this));
      // 2. Si la var lightBow des options existe (= est True), alors utilise la méthode createLightBox
      if (options.lightBox) {
        // Utilise la méthode de mauGallery createLightBox sur (this = cet élément), avec comme valeurs d'entrée le lightboxId et la var navigation (
        // renseignées dans les paramètres en entrée quand on appelle mauGallery)
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      // 3. On appelle la méthode listeners de mauGallery
      $.fn.mauGallery.listeners(options);

      // 4. pour chaque enfant de l'élément this (?), balance la fonction qui prend en entrée l'index et qui fait :
      $(this)
        .children(".gallery-item") // on se place dans l'élément HTML gallery item qui contient les items de la gallerie
        .each(function (index) {
          // Pour chaque item de la gallerie
          // Appelle la méthode responsivleImageItem ==> on fait de chaque élément une image responsive ?
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          // Appelle la méthode moveItemInRowWrapper ==> on wrappe les itemps en un certain nombre de lignes
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          // Appelle la méthode wrapItemInColumn , avec en paramètre supplémentaire la variable
          // column (le nombre de colonnes) donnée en entrée de la fonction mauGallery dans l'objet options.
          // ==> On wrappe les items en un certain nombre de colonnes définit manuellement dans les options de la fonction par l'user
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);

          // Définit la variable theTag comme la valeur contenue dans la variable "this" sous la clé "gallery-tag"

          // Dans le html, la div class gallery contient des images <img data-gallery-tag = "Concert" = "Entreprise" = "Entreprises"...
          // ce sont des images.

          // Donc theTag est une collection de tags "Concert", "Entreprise" et chaque tag correspond à une image ?
          //$( elem ).data( "foo", 42 );
          //$( elem ).data( "foo" ); // 42
          //$( elem ).data(); // { foo: 42 }

          var theTag = $(this).data("gallery-tag");

          if (
            options.showTags && // SI la valeur showTags contenue dans les options est true (= si on veut montrer la gallerie)
            theTag !== undefined && // ET QUE theTag n'est pas indéfinie
            // The indexOf() method returns the position of the first occurrence of a value in a string.
            // The indexOf() method returns -1 if the value is not found.
            // ET QUE la valeur contenue dans theTag n'est pas (déjà) dans tagsCollection
            tagsCollection.indexOf(theTag) === -1
          ) {
            // ALORS
            tagsCollection.push(theTag); // On ajoute theTags à la variable tagsCollection
          }
        });

      // Si la showTags de options (définie par l'user) est true
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          // ALORS on appelle la méthode showItemTags de mauGallery ==> elle permet d'afficher la gallery
          // Sur l'élément this
          $(this),
          // avec deux paramètres supplémentaires
          options.tagsPosition, // la valeur définie par l'user de option "tagsPosition" = 'top'
          tagsCollection // la variable tagCollection qu'on vient de compléter, et qui contient toutes les images ou les tags des images
        );
      }

      $(this).fadeIn(500); // L'apparition se fait progressivement en 500 ms (puisque l'élément était caché à la base)
    });
  };

  //
  //
  //
  // ON SORT DE LA FONCTION PRINCIPALE
  //
  //
  //

  // Valeurs par défaut de mauGallery, que viennent étendre/remplacer les valeurs des options
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  // DEFINTION DE LA FONCTION LISTENER DE MAUGALLERY
  $.fn.mauGallery.listeners = function (options) {
    // prend le paramètre options en entrée
    // Sur l'idem avec la classe gallery-item, au clic, déclenchement d'une fonction
    $(".gallery-item").on("click", function () {
      //SI lightBox est true et si la propriété tagName de l'élément est bien IMG
      // The .prop() method gets the property value for only the first element in the matched set.
      // It returns undefined for the value of a property that has not been set
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        // Appelle la méthde openLightBox sur l'élément this (c'est à dire les items de gallery-item)
        // avec un paramètre supplémentaire : l'id de la lightBox définie par l'user : 'myAwesomeLightbox'
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
        // Au clic sur la photo, on ouvre la modale avec l'aperçu, je pense ?
      } else {
        return;
      }
    });

    // Toujours dans la fonction listeners

    // Sur l'élément gallery, au clic sur l'élément de classe nav-link qui est un descendant de l'élément gallery, applique la méthode filterByTags
    // méthode filterByTag définie plus loin
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    // Sur l'élément gallery, au clic sur l'élément de classe mg-prev (previous), fonction qui appelle la méthode prevImage avec le paramètre
    //lightboxId choisi par l'user
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    // Sur l'élément gallery, au clic sur l'élément de classe mg-next (next), fonction qui appelle la méthode nextImage avec le paramètre
    //lightboxId choisi par l'user
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  // DEFINTION DES METHODES DE MAUGALLERY
  $.fn.mauGallery.methods = {
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode Create Row Wrapper ==> Méthode qui créé la div qui contient les rows
    createRowWrapper(element) {
      // SI le premier élément enfant de l'élément sur leque est appelé la fonction n'a pas de classe "row" (s'il n'y a pas déjà de row, si c'est vide ?)
      if (!element.children().first().hasClass("row")) {
        // ALORS on créé la div qui va contenir les row
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode wrap Item in column
    // Prend en entrée deux paramètres : l'élément et l'objet columns qui contient plein de trucs xs, sm...

    //
    // A constructor enables you to provide any custom initialization that must be done before any other methods can be called on an instantiated object.
    // Un constructor permet de créer un paramètre custom d'un élément ?
    // class Person {
    //constructor(name) {
    //this.name = name;
    //}
    // introduce() {
    //  console.log(`Hello, my name is ${this.name}`);
    //}
    //}

    // const otto = new Person("Otto"); // On créé un nouveau objet de l'instante Person
    // La caractéristique .introduce() de cet objet existe car elle a été définie dans l'instance
    // Cette caractéristique utilise la formule this.name
    // et ce qu'est .name est définit par le constructeur que name est le truc qu'on renseigne quand on créé l'objet et qu'on l'appelle en faisant
    // this.name

    //otto.introduce(); // Hello, my name is Otto

    // SERT A ATTRIBUER COMME CLASS A CHAQUE ELEMENT DE LA GALLERY DES VALEURS DE CLASS BOOTSTRAP POUR LES STYLER
    // le max de column bootstrap est 12, donc si on veut qu'il y ait 3 colonnes, il doit y avoir trois fois l'élément col-sm par ex
    // ET CA POUR CHAQUE DEVICE !! sm, lg, xl c'est en fonction des devices (le nombre de colonne varie en fonction des appareils)
    wrapItemInColumn(element, columns) {
      // SI le constructor de columns est un nombre (?) ==> dans le cas où il est pas définit par l'user ?
      if (columns.constructor === Number) {
        // c'est pour connaitre le type de columns = constructor
        element.wrap(
          // la méthode wrap entoure l'élément sur lequel elle est appelée avec la div renseignée après
          // math.ceil() arrondit et retourne le plus petit integer plus grand ou égal au nombre donné (arrondi au supérieur)
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
        // Un Object est un élément propre à jQuery
        // Si columns constructor est un Object (objet) ==> Tel qu'il doit être si correctement définit par l'user
      } else if (columns.constructor === Object) {
        var columnClasses = ""; // initialisation de la variable columnClasses comme un string vide
        if (columns.xs) {
          // Si la clé xs de column (définie par l'user) existe
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`; //ajouter une classe col- avec la valeur contenue dans xs : 12/xs (12)
        }
        if (columns.sm) {
          // si la clé sm de column existe
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`; // ajouter une classe col-sm-6(12/sm)
        }
        if (columns.md) {
          // si la clé md de column existe
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`; // ajouter une classe col-md-4(12/md)
        }
        if (columns.lg) {
          // si la clé lg de column existe
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`; // ajouter une classe col-lg-4(12/lg)
        }
        if (columns.xl) {
          // si la clé xl de column existe
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`; // ajouter une classe col-xl-4(12/lg)
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`); // on wrap l'élément de base en prenant en compte les classes
        //item column est dans la div de wrap ==> trouver l'alternative en JS vanilla
        //issues des variables de column
      } else {
        // Cas d'erreur
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode move Item In Row Wrapper ==> sert juste à rajouter un élément enfant à la div gallery-items-row
    moveItemInRowWrapper(element) {
      // Prend en paramètre d'entrée un element
      element.appendTo(".gallery-items-row"); // On rajoute l'élément element comme enfant au noeud HTML ayant pour classe .gallery-items-row
      // Qui est celui que l'on créé en premier avec createRowWrapper
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode responsive Image Item  ==> si l'élément est une image, ça rajoute une classe img-fluid*
    // C'est la classe Bootstrap qui rend les images responsives
    responsiveImageItem(element) {
      // Prend en entrée le paramètre element
      if (element.prop("tagName") === "IMG") {
        // si la propriété de l'élément ayant pour clé tagName est égale à IMG
        element.addClass("img-fluid"); // ajouter à l'élément une classe = img-fluid
      }
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode open Light Box ==> ouvrir la modale + attribuer à l'élément actif le même attribut src que l'élément lightboxImage (= token img actif)
    openLightBox(element, lightboxId) {
      // Prend en entrée deux paramètres : element et lightBoxId 'myAwesomeLightbox'
      $(`#${lightboxId}`) // sélectionne l'objet ayant pour id lightboxImage
        .find(".lightboxImage") // cherche le noeud ayant pour classe lightboxImage qui descend de l'élément sélectionné
        // attr() récupère la valeur d'un attribut du premier élément du set d'éléments OU définit un ou plusieurs attributs pour chaque
        // element matché ==> dans ce cas, attr(attributeName, attributeValue), il définit une valeur sous la clé "src" pour chacun des éléments
        // trouvés
        .attr("src", element.attr("src")); // il met sur l'élément enfant de lightboxId (celui ayant la classe lightboxImage == l'image qui est actuellement
      // en lightbox = en modale), le même src que celui de element en paramètre
      // ==> il met sur l'image en cours le même src que l'élément sur lequel la méthode est appelée

      $(`#${lightboxId}`).modal("toggle"); // sur l'élément avec l'id lightboxId
      // Fonction Bootstrap permettant d'ouvrir une modale, toggle étant l'option "si c'est ouvert, ferme et si c'est fermé, ouvre"
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode prev Image ==> permet de naviger entre les aperçus des images et d'aller à la précédente
    prevImage() {
      let activeImage = null; // Initialisation d'une variable null
      // Déterminer quelle image est active actuellement
      // Sélectionner les éléments img ayant pour classe gallery-item (ça marche sans espace ?)
      $("img .gallery-item").each(function () {
        // Pour chaque item, fonction :
        // SI l'attribut src de chaque élément est égal à l'attribut src de l'élément ayant pour classe .lightboxImage
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          // ALORS c'est l'image active
          activeImage = $(this); // la variable activeImage contient à présent l'image active (?)
        }
      });

      let activeTag = $(".tags-bar span.active-tag").data("images-toggle"); // sur l'élément ayant pour classe xxx, récupère la valeur correspondant
      // à la clé "image-toggle" (data sert à définir des paires clé-valeur ou à les récupérer) ==> c'est la valeur du FILTRE
      // data-image-toggle est dans la liste des tag, c'est la valeur du tag
      let imagesCollection = []; // initialisation de la variable
      if (activeTag === "all") {
        // SI la variable activeTag est égale à "all" ==> S'IL N'Y A PAS DE FILTRE !!
        $(".item-column").each(function () {
          // sur chaque élément ayant pour classe item-column (définis dans le wrapper ?)
          if ($(this).children("img").length) {
            // si cet élément à un enfant "img" qui a une longueur existante
            imagesCollection.push($(this).children("img")); // alors on ajoute cet élément enfant "img" à imageCollection
          }
        });
      } else {
        // SI activeTag est différent de all (SI IL Y A UN FILTRE)
        $(".item-column").each(function () {
          // Pour chaque item ayant pour classe item-column
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            // POUR chaque enfant "img" qui ont, pour la clé "gallery-tag",
            // une valeur égale à activeTag, alors :
            imagesCollection.push($(this).children("img")); // on ajoute ces images à la collection
          }
        });
      }
      let index = 0, // initialisation index
        next = null; // initialisation de next

      $(imagesCollection).each(function (i) {
        // pour chaque élément ajouté à imageCollection en prenant comme paramètre i
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          // SI l'attribut src de l'image active est égale à l'attribut src de l'élément
          index = i; // alors la variable index devient la valeur du compteur i, donc on a l'index (la place) de l'image active dans la collection
          // d'images imagesCollection
        }
      });
      // On attribue à next soit l'image contenue dans la var imageCollection  à l'index de l'image active
      // soit l'image contenue dans imageCollection qui a le dernier index (si c'est la dernière image ?)
      next =
        imagesCollection[index] || // si premier vide, deuxième valeur
        imagesCollection[imagesCollection.length - 1];

      $(".lightboxImage").attr("src", $(next).attr("src")); //on sélectionne l'élément ayant pour classe .lightboxImage (l'image active),
      // on lui attribut un attribut src qui est égal à l'attribut src de l'élément next
      // on met à jour l'attribut src de lightboxImage pour qu'il corresponde à celui de la prochaine image qu'on veut afficher
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode next Image ==> permet de naviger entre les aperçus des images et d'aller à la suivante
    nextImage() {
      // On détermine l'image active = c'est l'item de la gallery qui a l'attribut src égal à celui de l'élem .lightboxImage
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });

      let activeTag = $(".tags-bar span.active-tag").data("images-toggle"); // activeTag c'est la variable contenant la catégorie de FILTRAGE
      // data-image-toggle est dans la liste des tag, c'est la valeur du tag
      let imagesCollection = [];
      if (activeTag === "all") {
        // Si activeTag = all, alors on ajoute toutes les images de la gallerie à imagesCollection
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        // SINON on ajoute seulement celles qui correspondent au activeTag
        $(".item-column").each(function () {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      // On récupère l'index de l'image active
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
      // on définit next comme soit l'image active, soit l'item d'index zéro si c'est la première image
      next = imagesCollection[index] || imagesCollection[0];
      // on définit l'attribut src de lightboxImage comme le src de l'image next
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode Create Light Box ===> Créé toute la div qui contient la modale à partir de l'élément gallery
    createLightBox(gallery, lightboxId, navigation) {
      // prend en entrée trois paramètres gallery, lightboxId (déf par l'user) et navigation
      gallery.append(`<div class="modal fade" id="${
        // sur l'élément gallery en entrée, on rajoute une div class modal
        lightboxId ? lightboxId : "galleryLightbox" // l'id de cette div est égal à la valeur lightboxId
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode show Item Tags ===> créé la liste des tags et l'affiche
    showItemTags(gallery, position, tags) {
      // prend en entrée trois paramètres gallery, position, tags
      var tagItems = // initialisation de la var tagItems qui est une liste contenant le tag all
        // data-image-toggle est dans la liste des tag, c'est la valeur du tag
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';

      // pour chacun des tags, on applique la fonction
      $.each(tags, function (index, value) {
        // la fonction ajoute à la liste tagItems une valeur par tag avec une valeur data-images-toggle différente
        // data-image-toggle est dans la liste des tag, c'est la valeur du tag
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      // initialisation de la variable tagsRow qui est une liste ul qui contient tous les tag items
      // donc on a tagsRow qui est une liste ul contenant une liste li
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      // si la var position (définie par l'user) est = à bottom
      if (position === "bottom") {
        gallery.append(tagsRow); // on ajoute la liste des tags après la gallerie
      } else if (position === "top") {
        // si la var position est = à top
        gallery.prepend(tagsRow); // on ajoute la liste des tags avant la gallerie
      } else {
        console.error(`Unknown tags position: ${position}`); // sinon on renvoie une erreur
      }
    },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Méthode fitler by Tag ===> permet de changer le filtre
    filterByTag() {
      // si l'élément this a une classe active-tag, on coupe la fonction (si le tag est déjà actif)
      if ($(this).hasClass("active-tag")) {
        return;
      }

      // On recherche tous les éléments qui ont une classe active-tag et on leur enlève les classes active et active-tag (on remet à zéro la sélection)
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag"); // on prend l'élément actuel et on lui met la classe active-tag

      // initialisation de la variable tag qui prend la valeur correspondant à la clé images-toggle de l'élément this
      // data-image-toggle est dans la liste des tag, c'est la valeur du tag
      var tag = $(this).data("images-toggle");

      // Pour chaque item de la gallerie (pour chaque image), fonction :
      $(".gallery-item").each(function () {
        // chaque parent de chaque item de la gallerie qui a pour classe item-column, on le cache
        $(this).parents(".item-column").hide();

        // si tag == all (si on a pas de filtre)
        if (tag === "all") {
          // on montre tous les éléments parents item columns avec un délai de 300 ms
          $(this).parents(".item-column").show(300);
          // pareil si l'élément this a une valeur data gallery tag == tag, on montre tout
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    },
  };
})(jQuery);
