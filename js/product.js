$(function () {
  let product = JSON.parse(localStorage.getItem("product"));
  if (product) {
    $(".product-img").html(`
    <img src="${product.img}" width="500" height="500" class="pro-img">
    `);

    $(".product-details").html(`
    <h3>${product.name}</h3>
    <p>${product.price} <span>ريال</span></p>
    <p>${product.des}</p>
    <form class="product-form">
    <table class="table table-bordered">
    <tbody>
       <tr>
        <td class="col-2 offset-2">الموديل</td>
        <td class="col-6">
        <div class="input-group">
        <select class="custom-select">
            <option>حدد</option>
            <option>${product.model[0]}</option>
            <option>${product.model[1]}</option>
            </select>
        </div>
        </td>
        </tr>
        <tr>
        <td class="col-2 offset-2" id="color">اللون</td>
        <td class="col-6">
        <ul class="colors-container">
        </ul>
        </td>
        </tr>
    </tbody>
    </table>

    <div class="input-group">
      <button class="btn btn-secondary col-8 buy-now" type="submit" disabled>اشتر</button>
      <input type="number" class="form-control col-2 offset-2 quentity" min="1" value="1">
    </div>
    </form>
    `);

    product.colors.map((color) => {
      let colorClass;
      if (color === "silver") {
        colorClass = "silver";
      } else if (color === "space gray") {
        colorClass = "space-gray";
      } else if (color === "gold") {
        colorClass = "gold";
      }
      $(".colors-container").append(`
          <li class="chose-color">
             <span class='${colorClass}' data-bs-toggle="tooltip" data-bs-placement="top" title="${color}" data-color='${color}'></span>
          </li>
          `);
    });
  }

  // what is the model ?
  $(".custom-select").change(function () {
    localStorage.setItem("model", $(this).val());

    let color = localStorage.getItem("chosenColor");
    let model = localStorage.getItem("model");

    if (color !== "" && model !== "" && model !== "حدد") {
      $(".product-form button").attr("disabled", false);
    } else {
      $(".product-form button").attr("disabled", true);
    }

    // tracker(color, model);
  });

  // What is the color?

  $(".chose-color").click(function () {
    let chosenColor = $(this).children().data("color");

    if ($(this).data("clicked")) {
      localStorage.setItem("chosenColor", "");
      $(this).removeClass("chosen");
      $(this).removeData("clicked");
    } else if (!$(this).data("clicked")) {
      // delete this thisng from brfore clicked elemnt
      $(".chose-color").removeData("clicked");
      $(".chose-color").removeClass("chosen");

      // Now clicked
      $(this).data("clicked", true);
      localStorage.setItem("chosenColor", chosenColor);
      $(this).addClass("chosen");
    }

    let color = localStorage.getItem("chosenColor");
    let model = localStorage.getItem("model");

    if (color !== "" && model !== "" && model !== "حدد") {
      $(".product-form button").attr("disabled", false);
    } else {
      $(".product-form button").attr("disabled", true);
    }
  });

  // ----- Cart -----

  // Tracker color and model

  let inCartNow = JSON.parse(localStorage.getItem("cart")) || [];
  let sameElemFounded 
  $(".product-form").submit(function (e) {
    e.preventDefault();
    let object = JSON.parse(localStorage.getItem("product"));
    let correctColor = localStorage.getItem("chosenColor");
    let correctModel = localStorage.getItem("model");

    console.log(inCartNow)


    let newObj = {
      ...object,
      quintiti: $(".quentity").val(),
      price: parseInt(object.price) * parseInt($(".quentity").val()),
      colors: correctColor,
      model: correctModel,
    };

    if(inCartNow.length === 0){
      console.log('in cart is empty')
    }

     sameElemFounded = inCartNow.filter((item) => item.id === object.id);

    console.log(sameElemFounded)

    if (sameElemFounded.length === 0) {
      inCartNow.push(newObj);
      $(".order-done").attr("disabled", false);
    }
    if (sameElemFounded.length > 0) {
       console.log(sameElemFounded)

      let colorIsSame = sameElemFounded.filter(
        (item) => item.colors === correctColor
      );
      let modelIsSame = sameElemFounded.filter(
        (item) => item.model === correctModel
      );

      if (colorIsSame.length === 0 && modelIsSame.length === 0) {
        inCartNow.push(newObj);
      }

      let productIsThere = sameElemFounded.find(
        (item) => item.colors === correctColor && item.model === correctModel
      );

      if (!productIsThere) {
        inCartNow.push(newObj);
      }

      if (productIsThere) {
        let oldProQuen = productIsThere.quintiti;
        let oldProPrice = productIsThere.price;
        inCartNow = inCartNow.filter(
          (item) =>
            (!(
              item.colors === productIsThere.colors &&
              item.model === productIsThere.model
            ) &&
              item.id === productIsThere.id) ||
            item.id !== productIsThere.id
        );
        //تم التعديل على الكمية فقط
        newObj = {
          ...object,
          quintiti: parseInt($(".quentity").val()) + parseInt(oldProQuen),
          colors: correctColor,
          model: correctModel,
          price: parseInt(object.price) + parseInt(oldProPrice),
        };
        inCartNow.push(newObj);
      }
    }

    localStorage.setItem("cart", JSON.stringify(inCartNow));

    $("#salla").text(JSON.parse(localStorage.getItem("cart")).length);

    // Modal
    $(".cart-modal").modal("show");

    $(".cart-modal .modal-dialog").css({ transform: "translate(0px)" });
    $(".modal-backdrop").fadeIn();

    $(".cart-modal .modal-cart-items").html("");
    inCartNow = JSON.parse(localStorage.getItem("cart"));

    $(".total").html(`
      <p>المجموع :</p>
      <p> ${calcTotal(inCartNow)} ريال</p>`);


      // ----
      localStorage.setItem('chosenColor', '')
      localStorage.setItem('model', '')
      $('.colors-container').children().removeClass('chosen')
      $('.custom-select').prop('selectedIndex',0)
      $(".product-form button").attr("disabled", true);
      // -----

    cartSide(inCartNow);
  });

  // Calc Total:
  function calcTotal(array) {
    let total = array.reduce((accumelator, element) => {
      return accumelator + parseInt(element.price);
    }, 0);
    return total;
  }
  if (inCartNow.length === 0) {
    $(".order-done").attr("disabled", true);

    $(".total").html(`<p></p>`);
    $(".modal-cart-items").html(
      '<p class="empty-cart">لا توجد منتجات في السلة</p>'
    );
  } else {
    $(".total").html(`
        <p>المجموع :</p>
        <p> ${calcTotal(inCartNow)} ريال</p>`);
  }

  //
  function cartSide(inCartNow) {
    inCartNow.map((item, index) => {
      let modelStr = item.model;
      let capacity = modelStr.match(/\d\d\dGB/)[0];

      $(".modal-cart-items").append(`
      <li class="modal-cart-item" data-id="${item.id}" data-color="${item.colors}" data-model="${item.model}">
      <ion-icon name="close-outline" class="remove-item" data-id="${item.id}" data-color="${item.colors}" data-model="${item.model}" data-price="${item.price}"></ion-icon>
      <div>
        <img class="modal-product-img" src="${item.img}" alt="">
      </div>
      <div class="modal-cart-item-info">
        <p class="modal-product-name">${item.name}</p>
        <ul>
         <li>السعة: ${capacity}</li>
         <li> اللون: ${item.colors}</li>
        </ul>
        <div class="cart-price-qui">
          <div>
          الكمية
          <span>${item.quintiti}</span>
          </div>
          <div class="modal-price">${item.price} ريال</div>
        </div>
      </div>
    </li>
  `);
    });
    $(".remove-item").click((e) => removeItem(e));
  }

  // remove item from Cart
  function removeItem(e) {
    let itemId = parseInt(e.target.getAttribute("data-id"));
    let itemColor = e.target.getAttribute("data-color");
    let itemModel = e.target.getAttribute("data-model");
    let itemPrice = e.target.getAttribute("data-price");

    let oldTotal = $(".total p").last().text();

    $(
      `li[data-id='${itemId}'][data-color='${itemColor}'][data-model='${itemModel}']`
    ).fadeOut();

    let hasSameId = inCartNow.filter((item) => item.id === itemId);

    if (hasSameId.length === 1) {
      console.log(hasSameId)

      inCartNow = inCartNow.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(inCartNow));
    } else {
      console.log(hasSameId)

      inCartNow = inCartNow.filter(
        (item) =>
          item.id !== itemId ||
          (item.id === itemId && item.colors !== itemColor) ||
          item.model !== itemModel
      );

      localStorage.setItem("cart", JSON.stringify(inCartNow));
    }
    $("#salla").text(inCartNow.length);
    

    if (inCartNow.length === 0) {

      $(".order-done").attr("disabled", true);

      $(".total").html(`<p></p>`);
      $(".modal-cart-items").html(
        '<p class="empty-cart">لا توجد منتجات في السلة</p>'
      );
    } else {

      $(".order-done").attr("disabled", false);

      $(".total").html(`
          <p>المجموع :</p>
          <p> ${parseInt(oldTotal) - parseInt(itemPrice)} ريال</p>`);
    }
  }

  cartSide(inCartNow);

  // Tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

  // on page refresh remove color
  window.onbeforeunload = function () {
    localStorage.setItem("chosenColor", "");
    localStorage.setItem("model", "");
    return;
  };






  $(".order-done").click((e) => {
    $(".cart-modal").modal("show");
    $(".cart-modal .modal-dialog").css({ transform: "translate(-410px)" });
    $(".modal-backdrop").fadeOut("slow", function () {
      $(".cart-modal").modal("hide");
      localStorage.setItem('chosenColor', '')
      localStorage.setItem('model', '')
      $('.colors-container').children().removeClass('chosen')
      $('.custom-select').prop('selectedIndex',0)
      $(".product-form button").attr("disabled", true);
  
      inCartNow = []
  
      localStorage.setItem("cart", JSON.stringify(inCartNow));
  
      $(".total").html(`<p></p>`);
      $(".modal-cart-items").html(
        '<p class="empty-cart">لا توجد منتجات في السلة</p>'
      );

      $("#salla").text(JSON.parse(localStorage.getItem("cart")).length);
      $(".order-done").attr("disabled", true);


        






      $(".order-completed").modal("show");
      $(".order-completed .modal-dialog").slideDown(3000);

    });
  });
  

});



