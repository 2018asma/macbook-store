$(function () {
  // GET ALL PRODUCTS FROM API
  function requestData() {
    return $.getJSON(
      "https://raw.githubusercontent.com/2018asma/json/main/db.json"
    );
  }

  // FUCNTION RECIVE DATA FROM getAllProdcuts AND SHOW THEM IN PAGE
  async function showAllProducts() {
    let request = await requestData();
    request.map((product) => {
      let productInfo = JSON.stringify(product);
      $(".products").append(`
        <div class="col-6 col-md-4 col-lg-3">
         <div class="product" title='${product.name} '>
         <a class="product-in-main"  href="file:///Users/asma/Documents/javascript-course/mac-store/product.html" data-product='${productInfo}'>
         <img src=${product.img} class="img-fluid">
            <h6>${product.name}</h6>
            <p class="lead"> ${product.price} <span>ريال</span></p>
         </a>
          
            <a 
            href="file:///Users/asma/Documents/javascript-course/mac-store/product.html"
            class="btn btn-primary buy"
            data-product='${productInfo}'
            >اشتر</a>
         </div>
        </div>`);
    });
  }

  // Add to cart click Event to products
  async function AddToCart() {
    await showAllProducts();

    $(".buy").on("click", function (e) {
      let product = $(this).data("product");

      localStorage.setItem("product", JSON.stringify(product));
    });

    $(".product-in-main").on("click", function (e) {
        let product = $(this).data("product");
  
        localStorage.setItem("product", JSON.stringify(product));
      });
  }

  AddToCart();
});
