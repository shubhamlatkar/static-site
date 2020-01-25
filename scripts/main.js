// Initialize and add the map
function initMap() {
  // The location of Uluru
  var uluru = { lat: 18.461131, lng: 73.793096 };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru
  });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: uluru, map: map });
}

// $("#navbar a, .btn").on("click", function(event) {
//   if (this.hash !== "") {
//     const hash = this.hash;
//     $("html. body").animate(
//       {
//         scrollTop: ${hash}.offset().top - 100
//       },
//       800
//       );
//   }
// });
