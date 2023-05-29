const storeProducts = (_products) => {
  if (!_products) {
    alert("Attention");
    return;
  }
  localStorage.setItem("products", JSON.stringify(_products));
};

// Retrouver les produits déjà persistés en localStorage. Renvoie un tableau vide si il ne trouve rien
const _products = localStorage.getItem("products"); //j'ai déplacé cette variable hors de getProducts pour pouvoir l'utiliser plus bas
const getProducts = () => {
  //change _products par _productsInLocalStorage
  if (!_products || _products === "undefined") {
    return [];
  }
  return JSON.parse(_products);
};

let products = getProducts();

async function getOneProduct(id) {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}

async function displayInfo() {
  // récupération de la balise ou on va mettre les données final
  const cartItems = document.getElementById("cart__items");
  // création du fragment
  const fragment = new DocumentFragment();

  for await (product of products) {
    console.log(product);
    //On enregistre les infos du produit actuel de la boucle dans une variable, via un appel a l'api
    const productInfo = await getOneProduct(product._id);

    //creation de la balise article
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = product._id;

    article.innerHTML = `
    <div class="cart__item__img">
      <img src="${productInfo.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${productInfo.name}</h2>
        <p>${product.color}</p>
        <p>${productInfo.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
`;
    fragment.appendChild(article);
  }
  //ajout du fragment sur la page
  cartItems.appendChild(fragment);
  getTotal();
  modifyQtt();
  deleteItem();
}

function getTotal() {
  //Get la balise p prix
  const prices = document.querySelectorAll(".cart__item__content__description p:nth-child(3)");
  //addition des prix
  let total = 0;
  let totalQtt = 0;
  prices.forEach((e) => {
    //Le slice supprime l'espace vide et le symbole euro, et le number() va parser mes deux prix
    prix = parseInt(e.textContent);
    article = e.closest("article");
    qteInput = article.querySelector(".itemQuantity");
    const qteInputValue = qteInput.value || 0;
    total += prix * qteInputValue;
    totalQtt += parseInt(qteInputValue);
  });
  //ajout prix total dans le DOM
  const totalPrices = document.getElementById("totalPrice");
  totalPrices.innerHTML = total;
  //ajout quantité totale dans le DOM
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalQtt;
}
//fonction qui modifie la quantité et le prix total quand l'utilisateur modifie la quantité
function modifyQtt() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const newQuantity = event.target.value;
      getTotal();
      const cartItem = input.parentElement.parentElement.parentElement.parentElement;

      const productId = cartItem.dataset.id;

      let foundProduct = products.find((prod) => prod._id == productId);
      foundProduct.quantity = newQuantity; // update quantity (mutation) TODO à rechercher

      // const newProducts = products.map((p) => {
      //   const isTheOne = p._id === productId;
      //   if (isTheOne) {
      //     p.quantity = newQuantity;
      //   }
      //   return p;
      // });

      storeProducts(products);
    });
  });
}

function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const cartItem = button.parentElement.parentElement.parentElement.parentElement;
      const productId = cartItem.dataset.id;
      //remove the related product in the localstorage
      products = products.filter((prod) => prod._id !== productId);
      //Utilisation de la methode remove()
      cartItem.remove();
      //enregistrement du nouveau panier dans le LS
      storeProducts(products);
      //mettre a jour prix et quantité total en appelant la fonction getTotal
      getTotal();
      event.preventDefault();
    });
  });

  // getStorageProducts.forEach((_products) => {
  //   if (_products.id === cartItem.dataset.id) {
  //     cartItem.remove();
  //     localStorage.setItem("products", JSON.stringify(_products));
  //   }
  // });
}
displayInfo();

// ----------------------------------------------------------------------------------------------------------
// PASSER LA COMMANDE (Contrôle infos formulaire + récupération des données)
// ----------------------------------------------------------------------------------------------------------

//Expressions régulières (dois-je utiliser new regExp() ?)
let onlyLettersExpressions = /^[a-zA-ZäöüßÄÖÜÏâêéôûîÂÔÛÎÉ]+$/;
let noSpecialExpressions = /^\d+\s[A-z]+\s[A-z]+/;
let regularExpressions =
  /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

//Récupération des differents input
let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let addressInput = document.getElementById("address");
let cityInput = document.getElementById("city");
let emailInput = document.getElementById("email");

//Vérification du Prénom
firstNameInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(firstNameInput.value)) {
    document.getElementById("firstNameErrorMsg").innerHTML = `Le Prénom est valide`;
    document.getElementById("firstNameErrorMsg").style.color = "green";
    document.getElementById("firstName").style.color = "#A3EBDD";
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = `Le Prénom n'est pas valide`;
    document.getElementById("firstNameErrorMsg").style.color = "red";
  }
  return false;
});

//Vérification du Nom(pas de chiffre et caracteres spéciaux)
lastNameInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(lastNameInput.value)) {
    document.getElementById("lastNameErrorMsg").innerHTML = `Le Nom est valide`;
    document.getElementById("lastNameErrorMsg").style.color = "green";
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = `Le Nom n'est pas valide`;
    document.getElementById("lastNameErrorMsg").style.color = "red";
  }
  return false;
});

//Vérification addresse (pas de caracteres speciaux)
addressInput.addEventListener("change", () => {
  if (noSpecialExpressions.test(addressInput.value)) {
    document.getElementById("addressErrorMsg").innerHTML = `L'addresse est valide`;
    document.getElementById("addressErrorMsg").style.color = "green";
  } else {
    document.getElementById("addressErrorMsg").innerHTML = `L'addresse n'est pas valide`;
    document.getElementById("addressErrorMsg").style.color = "red";
  }
  return false;
});

//Vérification addresse
cityInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(cityInput.value)) {
    document.getElementById("cityErrorMsg").innerHTML = `La ville est valide`;
    document.getElementById("cityErrorMsg").style.color = "green";
  } else {
    document.getElementById("cityErrorMsg").innerHTML = `La ville n'est pas valide`;
    document.getElementById("cityErrorMsg").style.color = "red";
  }
  return false;
});

//Vérification e-mail
emailInput.addEventListener("change", () => {
  if (regularExpressions.test(emailInput.value)) {
    document.getElementById("emailErrorMsg").innerHTML = `L'adresse mail est valide`;
    document.getElementById("emailErrorMsg").style.color = "green";
  } else {
    document.getElementById("emailErrorMsg").innerHTML = `L'adresse mail n'est pas valide`;
    document.getElementById("emailErrorMsg").style.color = "red";
  }
  return false;
});

//------------------Gestion formulaire contact et validation de la commande-------------------

const orderBtn = document.getElementById("order");

orderBtn.addEventListener("click", (event) => {
  event.preventDefault(); //empêche le rechargement de la page
  //--------------Si le panier est vide, on affiche "Le panier est vide"------------
  if (_products === null || _products.length === 0) {
    alert("Votre panier est vide !");
  } else if (
    // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
    // On vérifie qu'aucun champ n'est vide
    !firstNameInput.value ||
    !lastNameInput.value ||
    !addressInput.value ||
    !cityInput.value ||
    !emailInput.value
  ) {
    alert("Vous devez renseigner tous les champs !");
    event.preventDefault();
  } else {
    //Récupération des id des produits du panier, dans le localStorage
    let idProducts = [];
    for (let i = 0; i < _products.length; i++) {
      idProducts.push(_products[i].idProduct);
    }
    console.log(idProducts);
    const orderObject = {
      contact: {
        firtName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value,
      },
      products: idProducts,
    };
    console.log(order);
    // On indique la méthode d'envoi des données
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderObject),
    };
    //console.log(options);
    // on envoie les données Contact et l'id des produits à l'API

    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
        document.location.href = `confirmation.html?orderId=${data.orderId}`;
      })

      .catch((err) => {
        console.log("Erreur Fetch product.js", err);
        alert("Un problème a été rencontré lors de l'envoi du formulaire.");
      });
    //----------------------------------------------On vide le localStorage---------------------------------------------------------------
    localStorage.clear();
  } //fin else
}); //fin écoute bouton Commander

// async function getOrderedProducts() {
//   const response = await fetch("http://localhost:3000/api/products/" + id);
//   if (response.ok) {
//     return response.json();
//   }
// }
