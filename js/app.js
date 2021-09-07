$(function () {
  let winH = $(window).height();

  let navbarH = $(".navbar").innerHeight();
  let sliderH = winH - navbarH;

  $(".slider, .carousel-item").height(sliderH);

  $(".navbar").children(".container").append('<span id="salla">0</span>');
  if (JSON.parse(localStorage.getItem("cart"))) {
    $("#salla").text(JSON.parse(localStorage.getItem("cart")).length);
  }


  $(".cart-modal").modal("hide");
  $(".order-completed").modal("hide");
//   $('.order-completed').show()

  $("#salla").click(function () {
    $(".cart-modal").modal("show");
    $(".cart-modal .modal-dialog").css({ transform: "translate(0px)" });
    $(".modal-backdrop").fadeIn();
  });

 

  $("button.close").click((e) => {
    $(".cart-modal .modal-dialog").css({ transform: "translate(-410px)" });
    $(".modal-backdrop").fadeOut("slow", function () {
      $(".cart-modal ").modal("hide");
    });
  });
});



$('.cart-modal .modal-dialog').click(function(event){
    event.stopPropagation();
})


$('.cart-modal').modal({backdrop: 'static', keyboard: false}) 

$(".cart-modal").click(function () {

    $(".cart-modal .modal-dialog").css({ transform: "translate(-410px)" });
    $(".modal-backdrop").fadeOut("slow", function () {
      $(".cart-modal").modal("hide");
    });
    
    console.log("FadeOut Out side")

   

  
});
