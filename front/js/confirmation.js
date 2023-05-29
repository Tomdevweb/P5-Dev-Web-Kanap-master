// On récupère la valeur du param 'orderId' de l'URL
let urlOrderId = new URLSearchParams(window.location.search).get("orderId");

//S'il n'y a pas d'orderId dans l'URL alors on redirige sur la page d'accueil du site
if (urlOrderId === null || urlOrderId === "") {
  alert("Une erreur s'est produite lors de la validation de votre commande. Veuillez nous en excuser !");
  window.location.href = "index.html";
}
//Sinon, on affiche la confirmation de la commande et le numéro de commande
else {
  // Vérifie si le numéro de commande est déjà stocké dans le stockage local
  let storedOrderId = localStorage.getItem("orderId");

  if (storedOrderId) {
    // Si le numéro de commande est déjà stocké, utilisez-le au lieu d'en générer un nouveau
    urlOrderId = storedOrderId;
  } else {
    // Génère un nouveau numéro de commande et stocke-le dans le stockage local
    urlOrderId = Math.floor(Math.random() * 1000000);
    localStorage.setItem("orderId", urlOrderId);
  }

  // Met à jour l'URL avec le numéro de commande
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("orderId", urlOrderId);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);

  // Sélection de l'élément html dans lequel on veut afficher le numéro de commande
  const idCommande = document.getElementById("orderId");
  // On insère le numéro de commande dans le html
  idCommande.innerText = urlOrderId;
  console.log(idCommande);
}
