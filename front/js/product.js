//récupération de l'id du produit via l'URL
function getUrlParams(param) {
  let url = new URL(window.location.href);
  return url.searchParams.get(param);
}

//On rappel l'API mais cette fois par produit
async function getOneProduct(id) {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}
//On appel les infos de chaque produits par l'Id
async function displayInfo() {
  let idProduct = getUrlParams("id");
  let product = await getOneProduct(idProduct);
  console.log(product);

  //ajouter la ref de l'id du produit sur le boutton-------------------
  const addToCart = document.getElementById("addToCart");
  addToCart.dataset.idProduct = product._id;

  //On insert le nom du produit dans la balise avec id "title"
  let productTitle = document.getElementById("title");
  console.log(productTitle);
  productTitle.innerText = product.name;

  //On insert le prix du produit dans la balise avec id "price"
  let productPrice = document.getElementById("price");
  console.log(productPrice);
  productPrice.innerText = product.price;

  //On insert la description du produit dans la balise avec id "description"
  let productDescription = document.getElementById("description");
  console.log(productDescription);
  productDescription.innerText = product.description;

  //A FAIRE : UTILISER FRAGMENT POUR COLORS ET IMAGES -->

  //On insert les couleurs du produit
  let productColors = document.getElementById("colors");
  productColors.innerText = product.colors;
  //On creer une boucle car plusieurs choix de couleurs
  for (let color of product.colors) {
    productColors.innerHTML += `<option value="${color}">${color}</option>`;
  }

  //On insert l'image + balise img dans la div (vu chez github du mec)
  let imageAlt = document.querySelector(".item__img");
  imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

displayInfo();

// ----------------------------------------------------------
// Condition de validation du clic bouton ajouter au panier
// ----------------------------------------------------------

//Fonction utilitaire reutilisable
const storeProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};
// Retrouver les produits déjà persistés en localStorage. Renvoie un tableau vide si il ne trouve rien
const getProducts = () => {
  return JSON.parse(localStorage.getItem("products") || "[]");
};

const addProductToCart = (productData) => {
  const productsInLS = getProducts();
  console.log(productsInLS);

  // No products yet
  if (!productsInLS.length) {
    //console.log("PRODUCTS NEVER STORED => ADD");
    // Create the array
    const products = [];
    // Add the product to persist in the array
    products.push(productData);
    // Persist the array
    storeProducts(products);
  }
  // Products already stored in LS
  else {
    const productWithSameIdAndColor = productsInLS.find((_prod) => {
      const sameId = _prod._id === productData._id;
      const sameColor = _prod.color === productData.color;
      const isSameIdAndColor = sameId && sameColor;
      return isSameIdAndColor;
    });
    if (productWithSameIdAndColor) {
      //console.log("PRODUCT ALREADY STORED BUT SAME COLOR => INCREMENT");
      let newValue = productWithSameIdAndColor.quantity + productData.quantity;
      if (newValue < 101) {
        productWithSameIdAndColor.quantity += productData.quantity; // Increment quantity
        storeProducts(productsInLS);
      } else {
        alert("la quantité max ne peut pas dépassé 100");
      }
    } else {
      //console.log("PRODUCT NOT PRESENT IN STORAGE => ADD");
      productsInLS.push(productData);
      storeProducts(productsInLS);
    }
  }
};

addToCart.addEventListener("click", (event) => {
  // Retrieve the product id
  const productId = event.target.getAttribute("data-id-product");
  //parseInt = converti un string en chiffre (si possible)
  const itemsQuantity = parseInt(document.getElementById("quantity").value);
  if (itemsQuantity > 0 && itemsQuantity < 101) {
    alert("Le produit a bien été ajouté au panier");
  } else {
    return alert("La quantité saisie n'est pas correct!");
  }
  // Get the selected color
  const color = document.getElementById("colors").value;
  // Save in local storage
  const productData = {
    _id: productId,
    quantity: itemsQuantity,
    color: color,
  };
  addProductToCart(productData);
});

//COMMENT ADRIEN : faire une fonction pour gerer le local storage, qui prend en paramettre un objet produit contenant id/color/qte
/*

recupéré le localstorage
tester si il est vide ou pas

si vide: on créer une nouvelle liste, on met le produit et on enregistre le LS
sinon:
  on fait un foreach sur le panier
  si id + color identique, on incremente la qte et ont renvoie la liste sur le LS
  si on ne toruve pas l'article, on le rajoute dans la liste qu'on envoie ensuite au LS

fonction utile

push()
json.parse()
json.stringify()
*/
