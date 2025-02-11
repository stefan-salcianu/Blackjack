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
  const dealer3 = document.getElementById("dealer_card3");
  const dealer4 = document.getElementById("dealer_card4");
  const dealer5 = document.getElementById("dealer_card5");
  const dealer6 = document.getElementById("dealer_card6");
  let hidden_card;
  let hidden_card_value;
  let value_player_cnt = 0;
  let value_dealer_cnt = 0;
  let cards_player = 0;
  let cards_dealer = 2;
  // localStorage.setItem("wins", "0");
  if (!localStorage.getItem("loses")) {
    localStorage.setItem("loses", "0");
  }
  if (!localStorage.getItem("wins")) {
    localStorage.setItem("wins", "0");
  }
  let loses = parseInt(localStorage.getItem("loses"));
  let wins = parseInt(localStorage.getItem("wins"));
  const loses_text = document.createElement("p");
  loses_text.innerText = "Loses: " + String(loses);
  loses_text.style.fontFamily = "'Times New Roman', Times, serif";
  loses_text.style.fontSize = 30 + "px";
  loses_text.style.position = "absolute";
  loses_text.style.left = "5%";
  loses_text.style.top = "0%";
  const wins_text = document.createElement("p");
  wins_text.innerText = "Wins: " + String(wins);
  wins_text.style.fontFamily = "'Times New Roman', Times, serif";
  wins_text.style.fontSize = 30 + "px";
  wins_text.style.position = "absolute";
  wins_text.style.right = "5%";
  wins_text.style.top = "0%";
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
  table.appendChild(wins_text);
  table.appendChild(loses_text);
  table.appendChild(mockText);

  let busted = false;
  let cards = [];
  let copy_cards = [];
  let game_over = false;
  hit.disabled = true;
  stay.disabled = true;
  again.disabled = true;
  let blackjack = false;

  // Load YouTube API only if it doesn't already exist
  if (!window.YT) {
    console.log("🚀 Manually loading YouTube API...");
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
  }

  var ytplayer;
  var isPlaying = false;
  function onYouTubeIframeAPIReady() {
    ytplayer = new YT.Player("ytplayer", {
      height: "0",
      width: "0",
      videoId: "PaFHwTjy1yE",
      playerVars: {
        autoplay: 0,
        controls: 0,
        mute: 0,
      },
      events: {
        onReady: function (event) {
          let musicButton = document.getElementById("playMusic");
          if (!musicButton) {
            return;
          }

          musicButton.addEventListener("click", function () {
            if (!ytplayer || typeof ytplayer.playVideo !== "function") {
              return;
            }

            console.log(
              "🎵 Button clicked. Video state:",
              ytplayer.getPlayerState()
            );

            ytplayer.unMute(); // Ensure sound plays

            if (isPlaying) {
              ytplayer.pauseVideo();
            } else {
              ytplayer.playVideo();
            }
            isPlaying = !isPlaying;
          });
        },
      },
    });
  }

  setTimeout(() => {
    if (!window.YT) {
      console.error("YouTube API still not loaded! Something is blocking it.");
    } else if (!ytplayer) {
      console.error("ytplayer is still undefined! Forcing initialization...");
      onYouTubeIframeAPIReady(); // Try forcing initialization
    } else {
      console.log("YouTube Player is now ready!");
    }
  }, 5000); // Wait 5 seconds to allow API to load

  fetch("blackjack.json")
    .then((response) => response.json())
    .then((data) => {
      cards = data.cards;
      if (!copy_cards.length) {
        copy_cards = [...cards];
      }
      console.log(cards);
    })
    .catch((error) => console.error("Failed to fetch responses:", error));

  ///deal event
  function deal_cards() {
    deal.disabled = true;
    hit.disabled = true;
    stay.disabled = true;
    randomj = Math.floor(Math.random() * cards.length);
    checkDeck();
    setTimeout(() => {
      player.src = cards[randomj].image;
      if (cards[randomj].value != "A") {
        value_player_cnt += parseInt(cards[randomj].value);
      } else {
        value_player_cnt += parseInt(cards[randomj].value11);
      }
      value_player.innerText = "Your value: " + String(value_player_cnt);
      cards.splice(randomj, 1);
      randomi = Math.floor(Math.random() * cards.length);
      checkDeck();
      setTimeout(() => {
        dealer1.src = cards[randomi].image;
        if (cards[randomi].value != "A") {
          value_dealer_cnt += parseInt(cards[randomi].value);
        } else {
          value_dealer_cnt += parseInt(cards[randomi].value11);
        }
        value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
        cards.splice(randomi, 1);
        randomj = Math.floor(Math.random() * cards.length);
        checkDeck();
        setTimeout(() => {
          player0.src = cards[randomj].image;
          if (cards[randomj].value != "A") {
            value_player_cnt += parseInt(cards[randomj].value);
          } else {
            value_player_cnt += parseInt(cards[randomj].value11);
          }
          value_player.innerText = "Your value: " + String(value_player_cnt);
          cards.splice(randomj, 1);

          randomi = Math.floor(Math.random() * cards.length);
          checkDeck();
          setTimeout(() => {
            dealer2.src = "images/back_card.png";
            hidden_card = cards[randomi].image;
            if (cards[randomi].value == "A") {
              hidden_card_value = parseInt(cards[randomi].value11);
            } else {
              hidden_card_value = parseInt(cards[randomi].value);
            }
            cards.splice(randomi, 1);
            hit.disabled = false;
            stay.disabled = false;
            if (value_player_cnt == 21) {
              wins = parseInt(localStorage.getItem("wins"));
              wins += 1;
              wins_text.innerText = "Wins: " + String(wins);
              localStorage.setItem("wins", String(wins));
              blackjack = true;
              setTimeout(() => {
                turnHiddenCard();
                ///implement BLACKJACK animation
                setTimeout(() => {
                  play_again();
                }, 2300);
              }, 700);
            }
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  }
  deal.addEventListener("click", () => {
    console.log("deal");
    deal_cards();
  });
  hit.addEventListener("click", () => {
    ///pica cazul cand primseti 2 asi
    checkDeck();
    setTimeout(() => {
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
        cards.splice(randomj, 1);
        if (value_player_cnt > 21) {
          busted = true;
          const busted_text = document.createElement("p");
          busted_text.innerText = "YOU BUSTED";
          busted_text.style.fontFamily = "'Times New Roman', Times, serif";
          busted_text.style.fontSize = 40 + "px";
          busted_text.style.position = "absolute";
          busted_text.style.left = "50%";
          busted_text.style.top = "55%";
          busted_text.style.transform = "translate(-50%,-50%)";
          busted_text.style.color = "#8A0303";
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
            if (busted == true) table.removeChild(busted_text);
            play_again();
          }, 2000);
        } else if (value_player_cnt == 21) {
          ///incepe dealerHit
          stay.disabled = true;
          hit.disabled = true;
          setTimeout(() => {
            if (value_dealer_cnt < 17) {
              dealer2.style.left = "39%";
              dealer1.style.left = "28%";
            }
            setTimeout(() => {
              dealerHit(cards_dealer);
              setTimeout(() => {
                play_again();
              }, 2000);
            }, 700);
          }, 700);
          turnHiddenCard();
        }
        value_player.innerText = "Your value: " + String(value_player_cnt);
      }
    }, 300);
  });
  stay.addEventListener("click", () => {
    stay.disabled = true;
    setTimeout(() => {
      if (value_dealer_cnt < 17) {
        dealer2.style.left = "39%";
        dealer1.style.left = "28%";
      }
      setTimeout(() => {
        dealerHit(cards_dealer);
        setTimeout(() => {
          play_again();
        }, 2000);
      }, 700);
    }, 700);
    hit.disabled = true;
    turnHiddenCard();
  });
  function checkDeck() {
    if (cards.length == 0) {
      stay.disabled = true;
      deal.disabled = true;
      hit.disabled = true;
      cards = [...copy_cards];
      setTimeout(() => {
        table.removeChild(change_text);
        console.log(copy_cards);
        stay.disabled = false;
        deal.disabled = false;
        hit.disabled = false;
      }, 3000); // Reupdates deck after 0.3 seconds
      const change_text = document.createElement("p");
      change_text.innerText = "DECK CHANGED";
      change_text.style.fontFamily = "'Times New Roman', Times, serif";
      change_text.style.fontSize = 40 + "px";
      change_text.style.position = "absolute";
      change_text.style.left = "50%";
      change_text.style.top = "55%";
      change_text.style.transform = "translate(-50%,-50%)";
      change_text.style.color = "#8A0303";
      table.appendChild(change_text);
      hit.disabled = true;
      stay.disabled = true;
    }
  }
  function play_again() {
    console.log(cards.length);
    console.log(copy_cards.length);
    value_player_cnt = 0;
    value_dealer_cnt = 0;
    cards_player = 0;
    game_over = false;
    blackjack = false;
    hit.disabled = true;
    stay.disabled = true;
    mockText.innerText = "Still here?:)";
    dealer1.src = "";
    dealer2.src = "";
    dealer3.src = "";
    dealer4.src = "";
    dealer5.src = "";
    dealer6.src = "";
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
    busted = false;
    dealer1.style.left = "44%";
    dealer2.style.left = "56%";
    cards_dealer = 2;
    deal_cards();
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
  function dealerHit(cards_dealer) {
    if (value_dealer_cnt >= 17 || cards_dealer >= 7) {
      checkWinner();
      return;
    }
    cards_dealer += 1;
    randomi = Math.floor(Math.random() * cards.length);
    checkDeck();
    switch (cards_dealer) {
      case 3:
        dealer3.src = cards[randomi].image;
        break;
      case 4:
        dealer4.src = cards[randomi].image;
        break;
      case 5:
        dealer5.src = cards[randomi].image;
        break;
      case 6:
        dealer6.src = cards[randomi].image;
        break;
      default:
        break;
    }
    if (cards[randomi].value != "A") {
      value_dealer_cnt += parseInt(cards[randomi].value);
    } else {
      value_dealer_cnt += parseInt(cards[randomi].value11);
    }
    cards.splice(randomi, 1);
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    setTimeout(() => {
      dealerHit(cards_dealer);
    }, 700);
  }
  function checkWinner() {
    if (value_dealer_cnt < value_player_cnt || value_dealer_cnt > 21) {
      wins = parseInt(localStorage.getItem("wins"));
      wins += 1;
      wins_text.innerText = "Wins: " + String(wins);
      localStorage.setItem("wins", String(wins));
    } else if (value_dealer_cnt > value_player_cnt) {
      loses = parseInt(localStorage.getItem("loses"));
      loses += 1;
      loses_text.innerText = "Loses: " + String(loses);
      localStorage.setItem("loses", String(loses));
    }
  }
});
