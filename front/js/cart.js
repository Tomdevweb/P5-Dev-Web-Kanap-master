const storeProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};
// Retrouver les produits déjà persistés en localStorage. Renvoie un tableau vide si il ne trouve rien
const getProducts = () => {
  return JSON.parse(localStorage.getItem("products") || "[]");
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
  const prices = document.querySelectorAll(
    ".cart__item__content__description p:nth-child(3)"
  );
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
    input.addEventListener("input", () => {
      getTotal();
    });
  });
}

/* */

function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const cartItem =
        button.parentElement.parentElement.parentElement.parentElement;
      const productId = cartItem.dataset.id;
      // TODO HERE: remove the related product in the localstorage
      products = products.filter((prod) => prod._id !== productId);
      // peopleMajorOnly = people.filter((p) => p.age > 18);
      //Utilisation de la methode remove()
      cartItem.remove();
      //mettre a jour prix et quantité total en appelant la fonction getTotal
      getTotal();
      event.preventDefault();
    });
  });
}

displayInfo();

//etape 10 : addeventlistiner sur bouton ne pas oublier le preventdefault !
