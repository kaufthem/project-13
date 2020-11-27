//Add the search container
$(".search-container").append(
  $("<form/>", {action: "#", method: "get"})
    .append($("<input>", {type: "search", id: "search-input", class: "search-input", placeholder: "Search..."}))
    .append($("<input>", {type: "submit", value: "🔍", id: "search-submit", class: "search-submit"})
      .click(function(){
        searchFilter();
      }))
)

//This function will filter the user data so that only cards whose name matches the search query are shown
function searchFilter() {
  var cards = document.getElementsByClassName(".card"),
  input = document.getElementById("search-input").value.toUpperCase();

  for (i = 0; i < 12; i++) {
    var cName = $(".card").eq(i).data("user").name.toUpperCase();
    if (cName.includes(input)) {
      $(".card").eq(i).css("display","flex");
    }
    else {
      $(".card").eq(i).css("display","none");
    }
  }
}

//Add the cards
var $card = $("<div/>", {class: "card"});
$card.append(
  $("<div/>", {class: "card-img-container"})
    .append($("<img/>", {class: "card-img", src: "https://placehold.it/90x90", alt: "profile picture"}))
);
$card.append(
  $("<div/>", {class: "card-info-container"})
    .append(
      $("<h3/>", {id: "name", class: "card-name cap"}).text("first last")
    )
    .append(
      $("<p/>", {class: "card-text"}).text("email")
    )
    .append(
      $("<p/>", {class: "card-text cap"}).text("city, state")
    )
);
$card.css("box-shadow","0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
for (i = 0; i < 12; i++) {
  $("#gallery").append($card.clone());
}

//Function that opens the modal. Takes a jQuery $card object as a parameter. Called when one of the cards is clicked.
function openModal(e) {
  var $modal = $("<div/>", {class: "modal-container"});

  var data = e.data("user");

  $modal.append(
    $("<div/>", {class: "modal"})
      .append(
        $("<button/>", {type: "button", id: "modal-close-btn", class: "modal-close-btn"})
          .click(function(){closeModal();})
          .append($("<strong/>")).text("X")
      )
      .append(
        $("<div/>", {class: "modal-info-container"})
          .append($("<img/>", {class: "modal-img", src: data.icon, alt: "profile picture"}))
          .append(
            $("<h3/>", {id: "name", class: "modal-name cap"}).text(data.name)
          )
          .append(
            $("<p/>", {class: "modal-text"}).text(data.email)
          )
          .append(
            $("<p/>", {class: "modal-text cap"}).text(data.city)
          )
          .append($("<hr>"))
          .append(
            $("<p/>", {class: "modal-text"}).text(data.cell)
          )
          .append(
            $("<p/>", {class: "modal-text"}).text(data.address)
          )
          .append(
            $("<p/>", {class: "modal-text"}).text(data.birthdate)
          )
      )
  );
  
  $modal.append(
    $("<div/>", {class: "modal-btn-container"})
      .append(
        $("<button/>", {type: "button", id: "modal-prev", class: "modal-prev btn"}).text("Prev")
          .click(function(){
            moveModal(data.index, -1)
          })
      )
      .append(
        $("<button/>", {type: "button", id: "modal-next", class: "modal-next btn"}).text("Next")
          .click(function(){
            moveModal(data.index, 1)
          })
      )
  );

  $("#gallery").after($modal);
}

//Function that closes the modal.
function closeModal() {
  $(".modal-container").remove();
}

//Function that increments or decrements the index of the modal being shown. Loops back around if the maximum or minimum is reached
function moveModal(original, increment) {
  var index = original + increment;
  if(index === -1) index = 11;
  if(index === 12) index = 0;
  while($(".card").eq(index).css("display") === "none") {
    index += increment;
    if(index === -1) index = 11;
    if(index === 12) index = 0;
  }
  closeModal();
  openModal($(".card").eq(index));
}

//Handles card clicks and modal clicks
$(window).click(function(e) {
  if (e.target.className === "card")
    openModal($(e.target));
  else if (e.target.parentNode.className === "card")
    openModal($(e.target.parentNode));
  else if (e.target.parentNode.parentNode.className === "card")
    openModal($(e.target.parentNode.parentNode));
  else if (e.target.className === "modal-container")
    closeModal();
});

//Adds the generated random users to the card's data and modifies its text.
function randomize(r)
{
  for (i = 0; i < 12; i++) {
    var card = document.getElementsByClassName("card")[i],
    cardData = {
      index: i,
      icon: r[i].picture.large,
      name: r[i].name.first + ' ' + r[i].name.last,
      email: r[i].email,
      city: r[i].location.city,
      cell: r[i].cell,
      address: r[i].location.street.number + ' ' + r[i].location.street.name + ', ' + r[i].location.state + ' ' + r[i].location.postcode,
      birthdate: 'Birthday: ' + r[i].dob.date.substring(5,7) + '/' + r[i].dob.date.substring(8,10) + '/' + r[i].dob.date.substring(0,4)
    };
    $(".card").eq(i).data("user", cardData);

    card.querySelector("img").src = cardData.icon;
    card.querySelector(".card-name").innerText = cardData.name;
    card.querySelector(".card-text").innerText = cardData.email;
    card.querySelectorAll(".card-text")[1].innerText = cardData.city;
  }
}

//Generates 12 random users
$.ajax({
  url: 'https://randomuser.me/api/?results=12&nat=us',
  dataType: 'json',
  success: function(data) {
    randomize(data.results);
  }
});