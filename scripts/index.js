$(document).ready(function() {
  $("#form").hide();
  $("#hotel-section").hide();
  $(".formLink").click(function() {
    $("#main").hide();
    $("#hotel-section").hide();
    $("#form").show();
  });
  $(".mainLink").click(function() {
    $("#form").hide();
    $("#hotel-section").hide();
    $("#main").show();
  });
  $("#hotelLink").click(function() {
    $("#form").hide();
    $("#main").hide();
    $("#hotel-section").show();
  });
});
