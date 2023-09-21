const storeProducts = (_products) => {
  if (!_products) {
    alert("Attention, pas de produits stockés!");
    return;
  }
  localStorage.setItem("products", JSON.stringify(_products));
};

// Retrouve produits déjà dans LS. Si aucun, renvoie tableau vide
const getStoredProducts = () => {
  const productsInLocalStorage = localStorage.getItem("products");
  if (!productsInLocalStorage || productsInLocalStorage === "undefined") {
    return [];
  }
  return JSON.parse(productsInLocalStorage);
};

let products = getStoredProducts();

async function getOneProduct(id) {
  try {
    const response = await fetch("http://localhost:3000/api/products/" + id);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

async function displayInfo() {
  const itemsContainer = document.getElementById("cart__items");
  const fragment = new DocumentFragment();

  for await (product of products) {
    // Enregistre infos du produit dans une variable, via appel a l'api
    const productInfos = await getOneProduct(product._id);

    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = product._id;

    article.innerHTML = `
    <div class="cart__item__img">
      <img src="${productInfos.imageUrl}" alt="${productInfos.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${productInfos.name}</h2>
        <p>${product.color}</p>
        <p>${productInfos.price} €</p>
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
  itemsContainer.appendChild(fragment);
  getTotal();
  modifyQtt();
  deleteItem();
}

function getTotal() {
  const prices = document.querySelectorAll(".cart__item__content__description p:nth-child(3)");
  let total = 0;
  let totalQtt = 0;

  prices.forEach((e) => {
    const price = parseInt(e.textContent);
    const article = e.closest("article");
    const qteInput = article.querySelector(".itemQuantity");
    const qteInputValue = qteInput.value || 0;
    total += price * qteInputValue;
    totalQtt += parseInt(qteInputValue);
  });

  const totalPrices = document.getElementById("totalPrice");
  totalPrices.innerHTML = total;

  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalQtt;
}

// Modifie quantité et prix total quand l'utilisateur modifie la quantité
function modifyQtt() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const newQuantity = event.target.value;
      getTotal();
      const cartItem = input.closest(".cart__item");
      const productId = cartItem.dataset.id;

      let foundProduct = products.find((prod) => prod._id == productId);
      foundProduct.quantity = newQuantity;

      storeProducts(products);
    });
  });
}

function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const cartItem = button.closest(".cart__item");
      const productId = cartItem.dataset.id;

      products = products.filter((prod) => prod._id !== productId);
      cartItem.remove();

      //enregistrement du nouveau panier dans le LS
      storeProducts(products);
      // Mise à jour prix et quantité totale
      getTotal();
      event.preventDefault();
    });
  });
}
displayInfo();

// Passer la commande (Contrôle infos formulaire)

const onlyLettersExpressions = /^[a-zA-ZäöüßÄÖÜÏâêéôûîÂÔÛÎÉ-]+$/;
const noSpecialExpressions = /^\d+\s[A-z]+\s[A-z]+/;
const regularExpressions = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

const firstNameMsg = document.getElementById("firstNameErrorMsg");
const lastNameMsg = document.getElementById("lastNameErrorMsg");
const addressMsg = document.getElementById("addressErrorMsg");
const cityMsg = document.getElementById("cityErrorMsg");
const emailMsg = document.getElementById("emailErrorMsg");

firstNameInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(firstNameInput.value.trim())) {
    firstNameMsg.textContent = "Le prénom est valide";
    firstNameMsg.style.color = "lightgreen";
  } else {
    firstNameMsg.textContent = "Le prénom n'est pas valide!";
    firstNameMsg.style.color = "red";
  }
  return false;
});

lastNameInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(lastNameInput.value.trim())) {
    lastNameMsg.textContent = "Le nom est valide";
    lastNameMsg.style.color = "lightgreen";
  } else {
    lastNameMsg.textContent = "Le nom n'est pas valide!";
    lastNameMsg.style.color = "red";
  }
  return false;
});

//Vérification addresse (pas de caracteres speciaux)
addressInput.addEventListener("change", () => {
  if (noSpecialExpressions.test(addressInput.value)) {
    addressMsg.textContent = "L'adresse est valide";
    addressMsg.style.color = "lightgreen";
  } else {
    addressMsg.textContent = "L'adresse n'est pas valide!";
    addressMsg.style.color = "red";
  }
  return false;
});

cityInput.addEventListener("change", () => {
  if (onlyLettersExpressions.test(cityInput.value.trim())) {
    cityMsg.textContent = "La ville est valide";
    cityMsg.style.color = "lightgreen";
  } else {
    cityMsg.textContent = "La ville n'est pas valide!";
    cityMsg.style.color = "red";
  }
  return false;
});

emailInput.addEventListener("change", () => {
  if (regularExpressions.test(emailInput.value.trim())) {
    emailMsg.textContent = "L'adresse email est valide";
    emailMsg.style.color = "lightgreen";
  } else {
    emailMsg.textContent = "L'adresse email n'est pas valide!";
    emailMsg.style.color = "red";
  }
  return false;
});

// Gestion formulaire et validation commande
const orderBtn = document.getElementById("order");

orderBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const quantityInputs = Array.from(document.querySelectorAll(".itemQuantity")); //Convertion en tableau car NodeList n'a pas les methodes d'un tableau
  const isIncorrectQuantity = quantityInputs.find((input) => input.value <= 0 || input.value > 100);

  const isMissingInputs = !firstNameInput.value || !lastNameInput.value || !addressInput.value || !cityInput.value || !emailInput.value;

  const formMessages = [firstNameMsg, lastNameMsg, addressMsg, cityMsg, emailMsg];
  const incorrectInput = formMessages.find((msg) => msg.style.color === "red");

  if (isIncorrectQuantity) {
    alert("La quantité saisie n'est pas correct! Veuillez choisir une quantité entre 1 et 100.");
  } else if (products === null || products.length === 0) {
    alert("Votre panier est vide !");
  } else if (isMissingInputs) {
    alert("Vous devez renseigner tous les champs !");
  } else if (incorrectInput) {
    alert("Un ou plusieurs champs sont invalides!");
  } else {
    // Récupération id des produits du panier, dans le localStorage
    const idProducts = products.map((product) => product._id);

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

    // Indique la méthode d'envoi des données
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderObject),
    };

    // Envoie des données contact et id des produits à l'API
    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        // Redirection vers page de confirmation en passant l'orderId dans l'URL
        document.location.href = `confirmation.html?orderId=${data.orderId}`;
      })
      .catch((err) => {
        console.log("Erreur Fetch product.js", err);
        alert("Un problème a été rencontré lors de l'envoi du formulaire.");
      });
    // Vide le localStorage
    localStorage.clear();
  }
});
