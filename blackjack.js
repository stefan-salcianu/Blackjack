document.addEventListener("DOMContentLoaded", () => {
  const hit = document.getElementById("hit_button");
  const stay = document.getElementById("stay_button");
  const deal = document.getElementById("deal_button");
  const again = document.getElementById("pg_button");
  const dealer1 = document.getElementById("dealer_card1");
  const dealer2 = document.getElementById("dealer_card2");
  const player = document.getElementById("player_card");
  const player0 = document.getElementById("player_card0");
  const table = document.querySelector(".table");
  const hit1 = document.getElementById("player_card1");
  const hit2 = document.getElementById("player_card2");
  const hit3 = document.getElementById("player_card3");
  const hit4 = document.getElementById("player_card4");
  const hit5 = document.getElementById("player_card5");
  const hit6 = document.getElementById("player_card6");

  let hidden_card;
  let hidden_card_value;
  let value_player_cnt = 0;
  let value_dealer_cnt = 0;
  let cards_player = 0;

  if (!localStorage.getItem("loses")) {
    localStorage.setItem("loses", "0");
  }
  let loses = parseInt(localStorage.getItem("loses"));
  const loses_text = document.createElement("p");
  loses_text.innerText = "Loses: " + String(loses);
  loses_text.style.fontFamily = "'Times New Roman', Times, serif";
  loses_text.style.fontSize = 30 + "px";
  loses_text.style.position = "absolute";
  loses_text.style.left = "5%";
  loses_text.style.top = "0%";
  const value_dealer = document.createElement("p");
  value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
  value_dealer.style.fontFamily = "'Times New Roman', Times, serif";
  value_dealer.style.fontSize = 30 + "px";
  value_dealer.style.position = "absolute";
  value_dealer.style.left = "5%";
  value_dealer.style.top = "10%";
  const value_player = document.createElement("p");
  value_player.innerText = "Your value: " + String(value_player_cnt);
  value_player.style.fontFamily = "'Times New Roman', Times, serif";
  value_player.style.fontSize = 30 + "px";
  value_player.style.position = "absolute";
  value_player.style.left = "5%";
  value_player.style.top = "80%";
  const mockText = document.createElement("p");
  mockText.innerText = "You dare to challenge me?";
  mockText.style.fontFamily = "'Times New Roman', Times, serif";
  mockText.style.fontSize = 30 + "px";
  mockText.style.fontWeight = "bold";
  mockText.style.position = "absolute";
  mockText.style.top = "10%";
  mockText.style.left = "60%";
  mockText.style.color = "darkgrey";
  table.appendChild(value_dealer);
  table.appendChild(value_player);
  table.appendChild(loses_text);
  table.appendChild(mockText);

  let busted = false;
  let cards = [];
  let game_over = false;
  hit.disabled = true;
  stay.disabled = true;
  again.disabled = true;

  fetch("blackjack.json")
    .then((response) => response.json())
    .then((data) => {
      cards = data.cards;
      console.log(cards);
    })
    .catch((error) => console.error("Failed to fetch responses:", error));
  console.log(cards);

  ///deal event

  deal.addEventListener("click", () => {
    console.log("deal");
    randomi = Math.floor(Math.random() * cards.length);
    dealer1.src = cards[randomi].image;
    if (cards[randomi].value != "A") {
      value_dealer_cnt += parseInt(cards[randomi].value);
    } else {
      value_dealer_cnt += parseInt(cards[randomi].value11);
    }
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    cards.splice(randomi, 1);
    randomj = Math.floor(Math.random() * cards.length);
    player.src = cards[randomj].image;
    if (cards[randomj].value != "A") {
      value_player_cnt += parseInt(cards[randomj].value);
    } else {
      value_player_cnt += parseInt(cards[randomj].value11);
    }
    value_player.innerText = "Your value: " + String(value_player_cnt);

    cards.splice(randomj, 1);
    randomj = Math.floor(Math.random() * cards.length);
    player0.src = cards[randomj].image;
    if (cards[randomj].value != "A") {
      value_player_cnt += parseInt(cards[randomj].value);
    } else {
      value_player_cnt += parseInt(cards[randomj].value11);
    }
    value_player.innerText = "Your value: " + String(value_player_cnt);
    cards.splice(randomj, 1);
    dealer2.src = "images/card back red.png";
    randomi = Math.floor(Math.random() * cards.length);
    hidden_card = cards[randomi].image;
    if (cards[randomi].value == "A") {
      hidden_card_value = parseInt(cards[randomi].value11);
    } else {
      hidden_card_value = parseInt(cards[randomi].value);
    }
    cards.splice(randomi, 1);
    deal.disabled = true;
    hit.disabled = false;
    stay.disabled = false;
  });
  hit.addEventListener("click", () => {
    ///pica cazul cand primseti 2 asi
    if (value_player_cnt < 21) {
      cards_player += 1;
      randomj = Math.floor(Math.random() * cards.length);
      switch (cards_player) {
        case 1:
          hit1.src = cards[randomj].image;
          break;
        case 2:
          hit2.src = cards[randomj].image;
          break;
        case 3:
          hit3.src = cards[randomj].image;
          break;
        case 4:
          hit4.src = cards[randomj].image;
          break;
        case 5:
          hit5.src = cards[randomj].image;
          break;
        case 6:
          hit6.src = cards[randomj].image;
          break;
        default:
          break;
      }

      if (cards[randomj].value != "A") {
        value_player_cnt += parseInt(cards[randomj].value);
      } else {
        value_player_cnt += parseInt(cards[randomj].value11);
      }
      if (value_player_cnt > 21) {
        busted = true;
        const busted_text = document.createElement("p");
        busted_text.classList.add("busted");
        busted_text.innerText = "YOU BUSTED";
        busted_text.style.fontFamily = "'Times New Roman', Times, serif";
        busted_text.style.fontSize = 40 + "px";
        busted_text.style.position = "absolute";
        busted_text.style.left = "50%";
        busted_text.style.top = "55%";
        busted_text.style.transform = "translate(-50%,-50%)";
        busted_text.style.color = "red";
        loses = parseInt(localStorage.getItem("loses"));
        loses += 1;
        loses_text.innerText = "Loses: " + String(loses);
        localStorage.setItem("loses", String(loses));
        table.appendChild(busted_text);
        mockText.innerText = "HAHA";
        mockText.style.left = "67%";
        stay.disabled = true;
        hit.disabled = true;
        setTimeout(() => {
          play_again();
        }, 1000);
      } else if (value_player_cnt == 21) {
        ///incepe dealerHit
        stay.disabled = true;
      }
      value_player.innerText = "Your value: " + String(value_player_cnt);
    } else {
      if (value_player_cnt == 21) {
        ///incepe dealerHit
        stay.disabled = true;
      }
    }
  });
  stay.addEventListener("click", () => {
    setTimeout(() => {
      dealer2.style.left = "40%";
      dealer1.style.left = "32%";
    }, 700);
    turnHiddenCard();
  });
  function play_again() {
    value_player_cnt = 0;
    value_dealer_cnt = 0;
    cards_player = 0;
    busted = false;
    game_over = false;
    hit.disabled = true;
    stay.disabled = true;
    deal.disabled = false;
    mockText.innerText = "Still here?:)";
    dealer1.src = "";
    dealer2.src = "";
    player.src = "";
    player0.src = "";
    hit1.src = "";
    hit2.src = "";
    hit3.src = "";
    hit4.src = "";
    hit5.src = "";
    hit6.src = "";
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    value_player.innerText = "Your value: " + String(value_dealer_cnt);
    busted_text = document.querySelector(".busted");
    table.removeChild(busted_text);
  }

  function turnHiddenCard() {
    busted = false;
    hit.disabled = true;
    stay.disabled = true;
    dealer2.style.transformOrigin = "center center";
    dealer2.style.transition =
      "transform 0.5s ease-in-out, left 0.7s, right 0.7s";
    dealer2.style.transform = "translate(-50%, -50%) rotateY(90deg)";
    setTimeout(() => {
      dealer2.src = hidden_card;
      dealer2.style.transform = "translate(-50%, -50%) rotateY(0deg)";
    }, 400);
    value_dealer_cnt += hidden_card_value;
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
  }
  function dealerHit() {
    ///to be implemented
    ///vezi switch de la hit
  }
});
