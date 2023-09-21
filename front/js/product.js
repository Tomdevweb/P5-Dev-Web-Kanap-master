// Récupération de l'id du produit via l'URL
function getUrlParams(param) {
  let url = new URL(window.location.href);
  return url.searchParams.get(param);
}

// Rappel de l'API par produit
async function getOneProduct(id) {
  try {
    const response = await fetch("http://localhost:3000/api/products/" + id);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}
// Appel infos chaque produit par l'id + affichage
async function displayInfo() {
  let idProduct = getUrlParams("id");
  let product = await getOneProduct(idProduct);

  // Creation dataset sur le boutton (data-id-product = id du produit)
  const addToCart = document.getElementById("addToCart");
  addToCart.dataset.idProduct = product._id;

  let productTitle = document.getElementById("title");
  productTitle.innerText = product.name;

  let productPrice = document.getElementById("price");
  productPrice.innerText = product.price;

  let productDescription = document.getElementById("description");
  productDescription.innerText = product.description;

  let productColors = document.getElementById("colors");
  for (let color of product.colors) {
    productColors.innerHTML += `<option value="${color}">${color}</option>`;
  }

  let imageAlt = document.querySelector(".item__img");
  imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}
displayInfo();

//Fonction utilitaire
const storeProducts = (products) => {
  if (!products) {
    alert("Attention, pas de produits stockés!");
    return;
  }
  localStorage.setItem("products", JSON.stringify(products));
};

// Retrouve les produits déjà persistés en LS. Renvoie tableau vide si ne trouve rien
const getStoredProduct = () => {
  const _products = localStorage.getItem("products");
  if (!_products || _products === "undefined") {
    return [];
  }
  //JSON.parse transforme la chaine de caractere en tableau/object
  return JSON.parse(_products);
};

const addProductToCart = (productData) => {
  const productStored = getStoredProduct();

  // Si pas encore de produit
  if (!productStored.length) {
    const products = [];
    products.push(productData);
    storeProducts(products);
  }
  // Produit deja stocké
  else {
    const productWithSameIdAndColor = productStored.find((_prod) => {
      const sameId = _prod._id === productData._id;
      const sameColor = _prod.color === productData.color;
      const isSameIdAndColor = sameId && sameColor;
      return isSameIdAndColor;
    });
    if (productWithSameIdAndColor) {
      let newValue = productWithSameIdAndColor.quantity + productData.quantity;
      if (newValue < 101) {
        productWithSameIdAndColor.quantity += productData.quantity;
        storeProducts(productStored);
      } else {
        alert("la quantité max ne peut pas dépassé 100");
      }
    } else {
      //produit pas stocké => ajout du produit
      productStored.push(productData);
      storeProducts(productStored);
    }
  }
};

addToCart.addEventListener("click", (event) => {
  const productId = event.target.getAttribute("data-id-product");
  const itemQuantity = parseInt(document.getElementById("quantity").value);
  const color = document.getElementById("colors").value;

  if (itemQuantity <= 0 || itemQuantity > 100) {
    return alert("La quantité saisie n'est pas correct! Veuillez choisir une quantité entre 1 et 100.");
  } else if (color === "") {
    return alert("Veuillez choisir une couleur!");
  } else {
    alert("Le produit a bien été ajouté au panier!");
  }

  // Sauvegarde dans LS
  const productData = {
    _id: productId,
    quantity: itemQuantity,
    color: color,
  };
  addProductToCart(productData);
});
