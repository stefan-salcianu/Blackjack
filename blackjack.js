document.addEventListener("DOMContentLoaded", () => {
  const hit = document.getElementById("hit_button");
  const stay = document.getElementById("stay_button");
  const deal = document.getElementById("deal_button");
  const again = document.getElementById("pg_button");
  const dealer1 = document.getElementById("dealer_card1");
  const dealer2 = document.getElementById("dealer_card2");
  const player = document.getElementById("player_card");
  const player0 = document.getElementById("player_card0");
  const table = document.getElementById("table");
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
  const musicButton = document.getElementById("playMusic");
  const pauseImg = document.getElementById("pause");
  const playImg = document.getElementById("play");
  const soundText = document.getElementById("soundText");
  const soundIcon = document.getElementById("soundIcon");
  const bustOdds_hit = document.getElementById("bustOdds_hit");
  const winOdds = document.getElementById("winOdds");
  const loseOdds = document.getElementById("loseOdds");
  const pushOdds = document.getElementById("pushOdds");
  const practice = document.getElementById("practice_button");
  const dealerCards = [dealer1, dealer3, dealer4, dealer5, dealer6];
  const player_cards = [hit1, hit2, hit3, hit4, hit5, hit6];

  let bjAnimation = false;
  let hidden_card;
  let hidden_card_value;
  let value_player_cnt = 0;
  let value_dealer_cnt = 0;
  let cards_player = 0;
  let cards_dealer = 2;
  let aces11Involved = 0;
  let aces11Involved_dealer = 0;

  ///score initialization
  if (!sessionStorage.getItem("loses")) {
    sessionStorage.setItem("loses", "0");
  }
  if (!sessionStorage.getItem("wins")) {
    sessionStorage.setItem("wins", "0");
  }
  if (!sessionStorage.getItem("blackjacks")) {
    sessionStorage.setItem("blackjacks", "0");
  }
  let loses = parseInt(sessionStorage.getItem("loses"));
  let wins = parseInt(sessionStorage.getItem("wins"));
  let blackjack_cnt = parseInt(sessionStorage.getItem("blackjacks"));
  const blackjack_text = document.getElementById("blackjackText");
  blackjack_text.innerText = String(blackjack_cnt);
  const loses_text = document.createElement("p");
  loses_text.innerText = "Today Loses: " + String(loses);
  loses_text.style.fontFamily = "'Times New Roman', Times, serif";
  loses_text.style.fontSize = "clamp(16px,3vw,33px)";
  loses_text.style.position = "absolute";
  loses_text.style.left = "5%";
  loses_text.style.top = "0%";
  const wins_text = document.createElement("p");
  wins_text.innerText = "Today Wins: " + String(wins);
  wins_text.style.fontFamily = "'Times New Roman', Times, serif";
  wins_text.style.fontSize = "clamp(16px,3vw,33px)";
  wins_text.style.position = "absolute";
  wins_text.style.right = "5%";
  wins_text.style.top = "0%";
  const value_dealer = document.createElement("p");
  value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
  value_dealer.style.fontFamily = "'Times New Roman', Times, serif";
  value_dealer.style.fontSize = "clamp(16px,3vw,33px)";
  value_dealer.style.position = "absolute";
  value_dealer.style.left = "5%";
  value_dealer.style.top = "10%";
  const value_player = document.createElement("p");
  value_player.innerText = "Your value: " + String(value_player_cnt);
  value_player.style.fontFamily = "'Times New Roman', Times, serif";
  value_player.style.fontSize = "clamp(16px,3vw,33px)";
  value_player.style.position = "absolute";
  value_player.style.left = "5%";
  value_player.style.top = "80%";
  const mockText = document.createElement("p");
  mockText.innerText = "You dare to challenge me?";
  mockText.style.fontFamily = "'Times New Roman', Times, serif";
  mockText.style.fontSize = "clamp(16px,3vw,33px)";
  mockText.style.fontWeight = "bold";
  mockText.style.position = "absolute";
  mockText.style.top = "10%";
  mockText.style.left = "60%";
  mockText.style.color = "darkgrey";
  let soundBar = document.getElementById("soundRange");
  // soundBar.type = "range";
  // soundBar.step = 0.1;
  // soundBar.min = 0.0;
  // soundBar.max = 1;
  // table.appendChild(soundBar);
  table.appendChild(value_dealer);
  table.appendChild(value_player);
  table.appendChild(wins_text);
  table.appendChild(loses_text);
  table.appendChild(mockText);
  ///score initialization
  let busted = false;
  let cards = [];
  let copy_cards = [];
  let playerHand = [];
  let dealerHand = { suit: "", value: "" };
  let game_over = false;
  hit.disabled = true;
  stay.disabled = true;
  again.disabled = true;
  practice.disabled = true;
  let blackjack = false;
  let caseAceDealer = false;
  let caseAcePlayer = false;
  let allowSpace = false;
  let dealerDone = false;

  ///aligning properly
  dealerCards.forEach((card) => {
    if (card) {
      card.style.top = "40%";
      card.style.left = "90%";
      card.style.transform = "none";
    }
  });
  player_cards.forEach((card) => {
    if (card) {
      card.style.left = "90%";
      card.style.top = "40%";
      card.style.transform = "none";
    }
  });
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
  async function sendDealtCards(dealtCards) {
    await fetch("http://127.0.0.1:5000/remove_dealt_cards", {
      method: "POST", // ✅ Must be POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealt_cards: dealtCards }),
    });
  }
  async function simulateWinningOdds(playerHand, dealerCard) {
    try {
      console.log(
        "🔍 Sending to Python:",
        JSON.stringify({
          player_hand: playerHand,
          dealer_card: dealerCard,
        })
      );

      const response = await fetch("http://127.0.0.1:5000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_hand: playerHand,
          dealer_card: dealerCard,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ Server Error: ${errorText}`);
      }

      const data = await response.json();
      return data.probabilities;
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      return null; // Return null if there's an error
    }
  }

  async function resetDeck() {
    await fetch("http://127.0.0.1:5000/reset_deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Deck reset in Python.");
  }

  const animationSound = new Audio("audio/rock_sound.wav");
  const shotSound = new Audio("audio/shot.wav");
  const cardSound = new Audio("audio/deal.wav");
  const jazzSound = new Audio("audio/jazz.mp3");
  shotSound.play().catch((e) => console.log("🔇 Autoplay blocked"));
  cardSound.play().catch((e) => console.log("🔇 Autoplay blocked"));
  animationSound.play().catch((e) => console.log("🔇 Autoplay blocked"));
  animationSound.volume = 0.5;
  shotSound.volume = 0.5;
  cardSound.volume = 0.5;
  jazzSound.volume = 0.5;
  // Function to start the sound
  function playSound() {
    animationSound.currentTime = 0;
    animationSound
      .play()
      .catch((error) => console.error("Audio play failed:", error)); // Handle autoplay issues
  }
  function playShotSound() {
    shotSound.currentTime = 0;
    shotSound
      .play()
      .catch((error) => console.error("Audio play failed:", error)); // Handle autoplay issues
  }
  function playCardSound() {
    cardSound.currentTime = 0;
    cardSound
      .play()
      .catch((error) => console.error("Audio play failed:", error)); // Handle autoplay issues
  }
  function playAmbient() {
    jazzSound.play();
  }
  jazzSound.addEventListener("ended", () => {
    jazzSound.currentTime = 0;
    jazzSound.play();
  });
  musicButton.addEventListener("click", () => {
    musicButton.blur();
    pauseImg.classList.toggle("hidden");
    playImg.classList.toggle("hidden");
    if (playImg.classList.contains("hidden")) {
      jazzSound.pause();
    } else playAmbient();
  });
  ///volume control
  soundBar.addEventListener("input", () => {
    animationSound.volume = soundBar.value;
    cardSound.volume = soundBar.value;
    shotSound.volume = soundBar.value;
    jazzSound.volume = soundBar.value;
    soundText.innerText =
      "Volume: " + String(Math.floor(parseFloat(soundBar.value) * 100)) + "%";
    soundText.style.opacity = "1";
    if (soundBar.value == 0) {
      anime({
        targets: "#soundIcon",
        rotate: 360,
        duration: 500,
        easing: "easeInOutQuad",
        complete: function () {
          soundIcon.src = "images/sound_off-removebg-preview.png";
        },
      });
    } else {
      anime({
        targets: "#soundIcon",
        rotate: 0,
        duration: 500,
        easing: "easeInOutQuad",
        complete: function () {
          soundIcon.src = "images/sound_on-removebg-preview.png";
        },
      });
    }
  });
  soundBar.addEventListener("change", () => {
    setTimeout(() => {
      soundText.style.opacity = "0";
    }, 1000);
  });
  soundBar.addEventListener("mouseenter", () => {
    soundText.style.opacity = "1";
  });
  soundBar.addEventListener("mouseleave", () => {
    soundText.style.opacity = "0";
  });
  ///volume control
  // Function to stop the sound
  function stopSound() {
    animationSound.pause();
  }
  ///deal function
  function deal_cards() {
    deal.disabled = true;
    hit.disabled = true;
    allowSpace = false;
    stay.disabled = true;
    player0.style.left = "90%";
    player0.style.top = "40%";
    player0.style.transform = "none";
    player.style.left = "90%";
    player.style.top = "40%";
    player.style.transform = "none";
    dealer1.style.left = "90%";
    dealer1.style.top = "40%";
    dealer1.style.transform = "none";
    randomj = Math.floor(Math.random() * cards.length);
    checkDeck();
    setTimeout(() => {
      playerHand.push({
        suit: cards[randomj].suit,
        value: cards[randomj].value,
      });

      sendDealtCards([
        { suit: cards[randomj].suit, value: cards[randomj].value },
      ]);
      let player_img = cards[randomj].image;
      player.src = "images/back_card.png";
      player.style.transform = "translate(-50%,-50%)";
      anime({
        targets: "#player_card",
        top: "85%",
        left: "47%",
        rotateY: { value: 45, duration: 50 }, // First rotate halfway
        easing: "easeInOutQuad",
        duration: 500,
        begin: function () {
          playCardSound();
        },
        complete: function () {
          document.getElementById("player_card").src = player_img; // Change image mid-turn

          anime({
            targets: "#player_card",
            rotateY: { value: 0, duration: 50 }, // Rotate back smoothly
            easing: "easeInOutQuad",
          });
        },
      });

      if (cards[randomj].value != "A") {
        value_player_cnt += parseInt(cards[randomj].value);
      } else {
        caseAcePlayer = true;
        value_player_cnt += parseInt(cards[randomj].value11);
        aces11Involved += 1;
      }
      value_player.innerText = "Your value: " + String(value_player_cnt);
      cards.splice(randomj, 1);
      randomi = Math.floor(Math.random() * cards.length);
      checkDeck();
      setTimeout(() => {
        dealerHand.suit = cards[randomi].suit;
        dealerHand.value = cards[randomi].value;

        sendDealtCards([
          { suit: cards[randomi].suit, value: cards[randomi].value },
        ]);
        let dealer1_img = cards[randomi].image;
        dealer1.src = "images/back_card.png";
        dealer1.style.transform = "translate(-50%,-50%)";
        anime({
          targets: "#dealer_card1",
          top: "47%",
          left: "44%",
          rotateY: { value: 45, duration: 50 }, // First rotate halfway
          easing: "easeInOutQuad",
          duration: 500,
          begin: function () {
            playCardSound();
          },
          complete: function () {
            document.getElementById("dealer_card1").src = dealer1_img; // Change image mid-turn

            anime({
              targets: "#dealer_card1",
              rotateY: { value: 0, duration: 50 }, // Rotate back smoothly
              easing: "easeInOutQuad",
            });
          },
        });
        if (cards[randomi].value != "A") {
          value_dealer_cnt += parseInt(cards[randomi].value);
          value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
        } else {
          aces11Involved_dealer++;
          caseAceDealer = true;
          value_dealer_cnt += parseFloat(cards[randomi].value11);
          value_dealer.innerText =
            "Dealer value: " +
            String(value_dealer_cnt) +
            "/" +
            String(value_dealer_cnt - 10);
        }
        cards.splice(randomi, 1);
        randomj = Math.floor(Math.random() * cards.length);
        checkDeck();

        setTimeout(() => {
          pauseImg;
          playerHand.push({
            suit: cards[randomj].suit,
            value: cards[randomj].value,
          });

          sendDealtCards([
            { suit: cards[randomj].suit, value: cards[randomj].value },
          ]);
          let player0_img = cards[randomj].image;
          player0.src = "images/back_card.png";
          player0.style.transform = "translate(-50%,-50%)";
          anime({
            targets: "#player_card0",
            top: "85%",
            left: "49%",
            rotateY: { value: 45, duration: 50 }, // First rotate halfway
            easing: "easeInOutQuad",
            duration: 500,
            begin: function () {
              playCardSound();
            },
            complete: function () {
              document.getElementById("player_card0").src = player0_img; // Change image mid-turn

              anime({
                targets: "#player_card0",
                rotateY: { value: 0, duration: 50 }, // Rotate back smoothly
                easing: "easeInOutQuad",
              });
            },
          });

          if (cards[randomj].value != "A") {
            value_player_cnt += parseInt(cards[randomj].value);
          } else {
            caseAcePlayer = true;
            aces11Involved += 1;
            if (value_player_cnt + parseInt(cards[randomj].value11) > 21) {
              value_player_cnt += parseInt(cards[randomj].value1);
              aces11Involved--;
            } else value_player_cnt += parseInt(cards[randomj].value11);
          }
          if (!aces11Involved || value_player_cnt == 21)
            value_player.innerText = "Your value: " + String(value_player_cnt);
          else {
            value_player.innerText =
              "Your value:" +
              String(value_player_cnt) +
              "/" +
              String(value_player_cnt - 10);
          }
          cards.splice(randomj, 1);

          randomi = Math.floor(Math.random() * cards.length);
          checkDeck();
          setTimeout(() => {
            dealer2.src = "images/back_card.png";
            sendDealtCards([
              { suit: cards[randomi].suit, value: cards[randomi].value },
            ]);
            playCardSound();
            hidden_card = cards[randomi].image;
            if (cards[randomi].value == "A") {
              if (caseAceDealer == true) {
                hidden_card_value = parseInt(cards[randomi].value1);
                value_dealer.innerText =
                  "Dealer value: " +
                  String(value_dealer_cnt) +
                  "/" +
                  String(value_dealer_cnt - 10);
              } else {
                caseAceDealer = true;
                aces11Involved_dealer++;
                hidden_card_value = parseInt(cards[randomi].value11);
              }
            } else {
              hidden_card_value = parseInt(cards[randomi].value);
            }
            cards.splice(randomi, 1);
            if (
              value_player_cnt == 21 ||
              (value_dealer_cnt + hidden_card_value == 21 &&
                hidden_card_value != 11) ///hidden blackjack
            ) {
              blackjack = true;
              // alert(value_dealer_cnt + hidden_card_value);
              if (
                value_player_cnt == 21 &&
                value_dealer_cnt + hidden_card_value != 21
              ) {
                wins = parseInt(sessionStorage.getItem("wins"));
                wins += 1;
                wins_text.innerText = "Today Wins: " + String(wins);
                sessionStorage.setItem("wins", String(wins));
                blackjack_cnt = parseInt(sessionStorage.getItem("blackjacks"));
                blackjack_cnt += 1;
                blackjack_text.innerText = String(blackjack_cnt);
                sessionStorage.setItem("blackjacks", String(blackjack_cnt));
                bjAnimation = true;
                ///implement BLACKJACK animation
                anime({
                  targets: "#box",
                  left: {
                    value: "25%",
                    duration: 1000,
                  },
                  top: {
                    value: "58%",
                    duration: 1000,
                  },
                  rotate: {
                    value: 4680,
                    duration: 2000,
                    easing: "easeInOutSine",
                  },
                  scale: {
                    value: 2,
                    duration: 1500,
                    delay: 800,
                    easing: "easeInOutQuart",
                  },
                  begin: function () {
                    playSound();
                    jazzSound.pause();
                    document.querySelector("#box p").style.opacity = "0";
                    // 👈 Hide <p> when animation starts
                    document.querySelector("#box p").style.animation = "none";
                  },
                  complete: function () {
                    anime({
                      targets: "#box p",
                      animation: {
                        value: "blinkingGlow 1s infinite alternate",
                      },
                      scale: [
                        { value: 3, duration: 300 },
                        { value: 1, duration: 300, delay: 500 },
                      ],
                      easing: "easeOutQuad",
                      complete: function () {
                        anime({
                          targets: [
                            "#B",
                            "#L",
                            "#A",
                            "#C",
                            "#K",
                            "#J",
                            "#A2",
                            "#C2",
                            "#K2",
                          ],
                          opacity: 1,
                          left: (el, i) => `${32 + i * 4}%`,
                          duration: 500,
                          easing: "easeOutQuad",
                          delay: (el, i) => i * 150,
                          begin: function (anim) {
                            anim.animatables.forEach((item, i) => {
                              setTimeout(() => {
                                playShotSound();
                              }, i * 150); // 🔥 Sync sound with delay of each letter
                            });
                          },
                          rotate: [
                            {
                              value: 45,
                              duration: 400,
                              easing: "easeOutQuad",
                            },
                            {
                              value: -15,
                              duration: 300,
                              delay: 300,
                              easing: "easeInOutQuad",
                            },
                            {
                              value: 10,
                              duration: 250,
                              easing: "easeOutSine",
                            },
                            {
                              value: 0,
                              duration: 350,
                              easing: "easeOutBounce",
                            },
                          ],
                          direction: "alternate", // Makes it reverse
                          complete: function () {
                            anime({
                              targets: "#box",
                              scale: {
                                value: 1,
                                duration: 1000,

                                easing: "easeInOutQuad",
                              },
                              left: {
                                value: "0%",
                                duration: 1500,
                                easing: "easeInOutQuad",
                              },
                              top: {
                                value: "0%",
                                duration: 1500,
                                easing: "easeInOutQuad",
                              },
                              rotate: {
                                value: 0,
                                duration: 2000,
                                easing: "easeInOutQuad",
                              },
                              complete: function () {
                                setTimeout(() => {
                                  play_again();
                                  stopSound();
                                  jazzSound.play();
                                  return;
                                }, 1000);
                              },
                            });
                          },
                        });
                      },
                    });
                  },
                });
              } else if (
                value_dealer_cnt + hidden_card_value ==
                value_player_cnt
              ) {
                const push_text = document.createElement("p");
                push_text.innerText = "PUSH";
                push_text.style.fontFamily = "'Times New Roman', Times, serif";
                push_text.style.fontSize = "clamp(16px,3vw,40px)";
                push_text.style.position = "absolute";
                push_text.style.left = "50%";
                push_text.style.top = "60%";
                push_text.style.transform = "translate(-50%,-50%)";
                push_text.style.color = "#8A0303";
                table.appendChild(push_text);
              } else {
                loses = parseInt(sessionStorage.getItem("loses"));
                loses += 1;
                loses_text.innerText = "Today Loses: " + String(loses);
              }
              value_dealer.innerText =
                "Dealer value: " + String(value_dealer_cnt);
              setTimeout(() => {
                turnHiddenCard();
                if (bjAnimation == false) {
                  dealerDone = true;
                  checkDone();
                }
              }, 700);
            }
            ///stay.click(); automode(not quite)
          }, 150);
        }, 150);
      }, 150);
    }, 150);
    if (value_player_cnt != 21 && value_dealer_cnt + hidden_card_value != 21)
      setTimeout(async () => {
        hit.disabled = false;
        stay.disabled = false;
        allowSpace = true;
        practice.disabled = false;
        throttledBustOddsCalculate();
        console.log(playerHand[0].value);
        console.log(playerHand[1].value);
        console.log(dealerHand.value);
        let Odds = await simulateWinningOdds(playerHand, dealerHand);
        console.log(Odds);
        winOdds.innerText = "WIN ODDS: " + Odds.win_percentage + "%";
        pushOdds.innerText = "PUSH ODDS: " + Odds.push_percentage + "%";
        loseOdds.innerText = "LOSE ODDS: " + Odds.loss_percentage + "%";
      }, 1000);
  }
  ///deal function
  ///deal event

  deal.addEventListener("click", async () => {
    console.log("deal");
    deal.blur();
    // Reset CSS conflicts
    deal.style.transition = "none"; // Remove conflicting transition
    deal.style.left = "50%";
    deal.style.bottom = "16%";
    deal.style.transform = "translate(-50%)"; // Ensure it starts correctly
    deal.style.animation = "none";
    deal.style.pointerEvents = "none";

    // Send the first four cards (two for player, two for dealer) to the backend
    anime({
      targets: "#deal_button",
      // Shrinks a bit before moving
      width: "100vw",
      easing: "easeInOutQuart", // LINEAR animation
      padding: 0,
      duration: 1200,
      complete() {
        anime({
          begin() {
            anime({
              targets: "#deal_button",
              height: "65vh",
              easing: "easeInOutQuart",
              duration: 600,
            });
          },
          delay: 700,
          targets: "#deal_button",
          left: "10%", // Moves left smoothly
          bottom: "90%", // Moves up smoothly
          opacity: 0, // Fades out
          easing: "easeInOutQuad", // Constant speed
          duration: 1000, // Adjust speed as needed
          complete() {
            jazzSound.play();
            pauseImg.classList.toggle("hidden");
            playImg.classList.toggle("hidden");

            deal_cards(); // Call function after animation finishes
          },
        });
      },
    });
    anime({
      targets: "#deal_button .btn-text",
      fontSize: 0,
      opacity: 0,
      easing: "easeInOutSine",
      duration: 300,
      begin() {
        document.querySelectorAll(".btn-text")[0].style.margin = "0px";
      },
    });
  });

  ///deal event

  ///hit event
  hit.addEventListener("click", () => {
    hit.blur();
    hit.disabled = true;
    stay.disabled = true;
    allowSpace = false;
    checkDeck();
    setTimeout(() => {
      if (value_player_cnt < 21) {
        cards_player += 1;
        randomj = Math.floor(Math.random() * cards.length);
        playerHand.push({
          suit: cards[randomj].suit,
          value: cards[randomj].value,
        });
        sendDealtCards([
          { suit: cards[randomj].suit, value: cards[randomj].value },
        ]);
        let playerx_img;
        let id;
        switch (cards_player) {
          case 1:
            id = "player_card1";
            break;
          case 2:
            id = "player_card2";
            break;
          case 3:
            id = "player_card3";
            break;
          case 4:
            id = "player_card4";
            break;
          case 5:
            id = "player_card5";
            break;
          case 6:
            id = "player_card6";
            break;
          default:
            console.error(`Unexpected cards_dealer value: ${cards_dealer}`);
            return;
        }

        const playerCard = document.getElementById(id);
        if (!playerCard) {
          console.error(`Element with ID '${id}' not found!`);
          return;
        }

        playerx_img = cards[randomj].image;
        playerCard.src = "images/back_card.png";
        playerCard.style.transform = "translate(-50%,-50%)";
        anime({
          targets: "#" + id,
          top: "85%",
          left: `${49 + cards_player * 2}%`,
          rotateY: { value: 44, duration: 50 },
          easing: "easeInOutQuad",
          duration: 500,
          begin: function () {
            cardSound.play();
          },
          complete: function () {
            playerCard.src = playerx_img;
            anime({
              targets: "#" + id,
              rotateY: { value: 0, duration: 50 },
              easing: "easeInOutQuad",
              duration: 200,
            });
          },
        });
        setTimeout(() => {
          if (cards[randomj].value != "A") {
            value_player_cnt += parseInt(cards[randomj].value);
            if (!aces11Involved) {
              value_player.innerText =
                "Your value: " + String(value_player_cnt);
            } else {
              if (value_player_cnt > 21) {
                value_player_cnt -= 10;
                aces11Involved--;
                value_player.innerText =
                  "Your value: " + String(value_player_cnt);
              } else {
                value_player.innerText =
                  "Your value: " +
                  String(value_player_cnt) +
                  "/" +
                  String(value_player_cnt - 10);
              }
            }
          } else {
            console.log("HIT AN ACE!"); // Debugging
            console.log(
              "Before Ace Addition: value_player_cnt =",
              value_player_cnt
            );
            console.log("aces11Involved =", aces11Involved);
            caseAcePlayer = true;
            aces11Involved++;
            value_player_cnt += parseInt(cards[randomj].value11);
            console.log(
              "After Ace Addition: value_player_cnt =",
              value_player_cnt
            );
            if (value_player_cnt > 21) {
              aces11Involved--;
              value_player_cnt -= 10;
              if (!aces11Involved) {
                value_player.innerText =
                  "Your value: " + String(value_player_cnt);
              } else {
                value_player.innerText =
                  "Your value: " +
                  String(value_player_cnt) +
                  "/" +
                  String(value_player_cnt - 10);
              }
            } else {
              if (value_player_cnt == 21) {
                value_player.innerText =
                  "Your value: " + String(value_player_cnt);
                console.log("Player reached 21, updating UI...");
              } else {
                value_player.innerText =
                  "Your value: " +
                  String(value_player_cnt) +
                  "/" +
                  String(value_player_cnt - 10);
              }
            }
            console.log("Final Display:", value_player.innerText);
          }

          console.log(aces11Involved + "cx");
          cards.splice(randomj, 1);
          if (value_player_cnt > 21) {
            busted = true;
            const busted_text = document.createElement("p");
            busted_text.innerText = "YOU BUSTED";
            busted_text.style.fontFamily = "'Times New Roman', Times, serif";
            busted_text.style.fontSize = "clamp(16px,3vw,33px)";
            busted_text.style.position = "absolute";
            busted_text.style.left = "50%";
            busted_text.style.top = "60%";
            busted_text.style.transform = "translate(-50%,-50%)";
            busted_text.style.color = "#8A0303";
            loses = parseInt(sessionStorage.getItem("loses"));
            loses += 1;
            loses_text.innerText = "Today Loses: " + String(loses);
            sessionStorage.setItem("loses", String(loses));
            table.appendChild(busted_text);
            mockText.innerText = "HAHA";
            mockText.style.left = "67%";
            setTimeout(() => {
              table.removeChild(busted_text);
              play_again();
            }, 2000);
          } else if (value_player_cnt == 21) {
            ///
            ///incepe dealerHit
            value_player.innerText = "Your value: " + String(value_player_cnt);
            setTimeout(() => {
              if (value_dealer_cnt < 17) {
                dealer2.style.left = "39%";
                dealer1.style.left = "28%";
              }
              setTimeout(() => {
                dealerHit(cards_dealer);
                setTimeout(() => {
                  play_again();
                }, 3000);
              }, 700);
            }, 700);
            turnHiddenCard();
          }
        }, 500);
      }
    }, 300);
    if (value_player_cnt < 21)
      setTimeout(async () => {
        hit.disabled = false;
        stay.disabled = false;
        allowSpace = true;
        throttledBustOddsCalculate();
        console.log(playerHand[cards_player + 1].value);
        let Odds = await simulateWinningOdds(playerHand, dealerHand);
        console.log(Odds);
        winOdds.innerText = "WIN ODDS: " + Odds.win_percentage + "%";
        pushOdds.innerText = "PUSH ODDS: " + Odds.push_percentage + "%";
        loseOdds.innerText = "LOSE ODDS: " + Odds.loss_percentage + "%";
      }, 1100);
  });
  ///hit event
  let bustOddsTimeout;
  function throttledBustOddsCalculate() {
    clearTimeout(bustOddsTimeout);
    bustOddsTimeout = setTimeout(() => {
      bustOddsCalculate();
    }, 500); // Runs once every 500ms
  }

  ///stay event
  stay.addEventListener("click", () => {
    stay.blur();
    hit.disabled = true;
    allowSpace = false;
    value_player.innerText = "Your value: " + String(value_player_cnt);
    stay.disabled = true;
    setTimeout(() => {
      dealerHit(cards_dealer);

      checkDone();
    }, 1400);
    bustOdds_hit.innerText = "Good luck!";
    turnHiddenCard();
  });
  ///stay event
  function checkDone() {
    if (dealerDone == false) {
      setTimeout(() => {
        checkDone();
      }, 100);
    } else {
      setTimeout(() => {
        play_again();
      }, 3000);
    }
  }

  ///checking if deck needs changed
  function checkDeck() {
    if (cards.length == 0) {
      stayInitial = stay.disabled;
      hitInitial = hit.disabled;
      dealInitial = deal.disabled;
      allowSpaceInitial = allowSpace;
      console.log("Before resetDeck() call...");
      resetDeck();
      console.log("resetDeck() completed.");

      console.log("Before copying cards...");
      cards = [...copy_cards];
      console.log("Cards copied, new deck size:", cards.length);

      console.log("Before enabling buttons...");
      stay.disabled = stayInitial;
      deal.disabled = dealInitial;
      hit.disabled = hitInitial;
      allowSpace = allowSpaceInitial;
      console.log("Buttons re-enabled.");

      resetDeck();
      setTimeout(() => {
        table.removeChild(change_text);
        console.log(copy_cards);

        ///resets the functions to buttons the same they were at the moment of checking
      }, 3000); // Reupdates deck after 0.3 seconds
      const change_text = document.createElement("p");
      change_text.innerText = "DECK CHANGED";
      change_text.style.fontFamily = "'Times New Roman', Times, serif";
      change_text.style.fontSize = "clamp(16px,3vw,33px)";
      change_text.style.position = "absolute";
      change_text.style.left = "50%";
      change_text.style.top = "60%";
      change_text.style.transform = "translate(-50%,-50%)";
      change_text.style.color = "#8A0303";
      table.appendChild(change_text);
      console.log("checkDeck() finished execution.");
    }
  }
  ///checking if deck needs changed

  ///play again
  function play_again() {
    console.log(cards.length);
    console.log(copy_cards.length);
    playerHand = [];
    value_player_cnt = 0;
    value_dealer_cnt = 0;
    cards_player = 0;
    game_over = false;
    blackjack = false;
    hit.disabled = true;
    allowSpace = false;
    stay.disabled = true;
    caseAceDealer = false;
    caseAcePlayer = false;
    aces11Involved = 0;
    aces11Involved_dealer = 0;
    mockText.innerText = "Still here?:)";
    dealer2.src = "";
    player.src = "";
    player0.src = "";
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    value_player.innerText = "Your value: " + String(value_dealer_cnt);
    busted = false;
    dealer1.style.left = "44%";
    dealer2.style.left = "56%";
    cards_dealer = 2;
    dealerDone = false;
    bjAnimation = false;
    anime.remove([
      "#dealer_card3",
      "#dealer_card4",
      "#dealer_card5",
      "#dealer_card6",
      "#player_card1",
      "#player_card2",
      "#player_card3",
      "#player_card4",
      "#player_card5",
      "#player_card6",
    ]);
    resetDealerCards();
    resetPlayerCards();
    deal_cards();
  }
  ///play again
  function resetDealerCards() {
    dealerCards.forEach((card) => {
      if (card) {
        card.style.left = "90%";
        card.style.top = "40%";
        card.style.transform = "none";
        card.src = "";
      }
    });
  }
  function resetPlayerCards() {
    player_cards.forEach((elem) => {
      if (elem) {
        elem.style.top = "40%";
        elem.style.left = "90%";
        elem.style.transform = "none";
        elem.src = "";
      }
    });
  }
  ///turn hidden card
  function turnHiddenCard() {
    console.log("turnHiddenCard() called!"); // Debugging
    busted = false;
    hit.disabled = true;
    allowSpace = false;
    stay.disabled = true;
    value_dealer_cnt += hidden_card_value;

    if (caseAceDealer && !blackjack && value_dealer_cnt < 18) {
      value_dealer.innerText =
        "Dealer value: " +
        String(value_dealer_cnt) +
        "/" +
        String(value_dealer_cnt - 10);
    } else {
      value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    }
    if (
      (value_dealer_cnt < 17 || (value_dealer_cnt == 17 && caseAceDealer)) &&
      !blackjack
    ) {
      anime({
        targets: "#dealer_card2",
        left: "39%",
        easing: "easeInOutQuad",
        duration: 700,
      });

      anime({
        targets: "#dealer_card1",
        left: "28%",
        easing: "easeInOutQuad",
        duration: 700,
      });
    }

    dealer2.style.transformOrigin = "center center";
    dealer2.style.transition = "transform 0.5s ease-in-out";

    // First, rotate the card
    dealer2.style.transform = "translate(-50%, -50%) rotateY(90deg)";

    setTimeout(() => {
      dealer2.src = hidden_card;
      dealer2.style.transform = "translate(-50%, -50%) rotateY(0deg)";
    }, 400);
  }

  ///turn hidden card

  ///dealer action
  function dealerHit(cards_dealer) {
    // Stop condition: if dealer’s total is 17 or more (or if too many cards have been drawn)
    if (
      (value_dealer_cnt >= 17 || cards_dealer >= 7) &&
      (aces11Involved_dealer === 0 || value_dealer_cnt !== 17)
    ) {
      dealerDone = true;
      if (value_dealer_cnt === 21) {
        value_dealer.innerText = "Dealer value: " + value_dealer_cnt;
      }
      checkWinner();
      return;
    }

    // Increment dealer card count
    cards_dealer++;

    // Draw a card at random from the deck and update the deck if needed
    let randomj = Math.floor(Math.random() * cards.length);
    checkDeck();

    // Determine which dealer card element to update
    let id;
    switch (cards_dealer) {
      case 3:
        id = "dealer_card3";
        break;
      case 4:
        id = "dealer_card4";
        break;
      case 5:
        id = "dealer_card5";
        break;
      case 6:
        id = "dealer_card6";
        break;
      default:
        console.error(`Unexpected cards_dealer value: ${cards_dealer}`);
        return;
    }

    const dealerCard = document.getElementById(id);
    if (!dealerCard) {
      console.error(`Element with ID '${id}' not found!`);
      return;
    }

    let dealerx_img = cards[randomj].image;
    dealerCard.src = "images/back_card.png";
    dealerCard.style.transform = "translate(-50%,-50%)";

    // Animate card dealing and flip using anime.js
    anime({
      targets: "#" + id,
      top: "47%",
      left: `${39 + (cards_dealer - 2) * 11}%`,
      rotateY: { value: 45, duration: 50 },
      easing: "easeInOutQuad",
      duration: 500,
      begin: function () {
        cardSound.play();
      },
      complete: function () {
        // Change image mid-turn
        dealerCard.src = dealerx_img;
        anime({
          targets: "#" + id,
          rotateY: { value: 0, duration: 50 },
          easing: "easeInOutQuad",
          duration: 200,
          complete: function () {
            // Now update the dealer's total based on the drawn card
            if (cards[randomj].value !== "A") {
              value_dealer_cnt += parseInt(cards[randomj].value);
              if (!aces11Involved_dealer) {
                value_dealer.innerText = "Dealer value: " + value_dealer_cnt;
              } else {
                if (value_dealer_cnt > 21) {
                  value_dealer_cnt -= 10;
                  aces11Involved_dealer--;
                  value_dealer.innerText = "Dealer value: " + value_dealer_cnt;
                } else {
                  value_dealer.innerText =
                    "Dealer value: " +
                    value_dealer_cnt +
                    "/" +
                    (value_dealer_cnt - 10);
                }
              }
            } else {
              caseAceDealer = true;
              aces11Involved_dealer++;
              value_dealer_cnt += parseInt(cards[randomj].value11);
              if (value_dealer_cnt > 21) {
                aces11Involved_dealer--;
                value_dealer_cnt -= 10;
              }
              if (aces11Involved_dealer === 0) {
                value_dealer.innerText = "Dealer value: " + value_dealer_cnt;
              } else {
                value_dealer.innerText =
                  "Dealer value: " +
                  value_dealer_cnt +
                  "/" +
                  (value_dealer_cnt - 10);
              }
            }

            // Remove the used card from the deck
            cards.splice(randomj, 1);

            // After a short delay, check if the dealer should hit again
            if (
              value_dealer_cnt < 17 ||
              (value_dealer_cnt === 17 && caseAceDealer)
            ) {
              setTimeout(() => {
                dealerHit(cards_dealer);
              }, 1000);
            } else {
              dealerDone = true;
              checkWinner();
            }
          },
        });
      },
    });
  }

  ///space for hit
  window.addEventListener("keydown", (e) => {
    if (e.key === " " && allowSpace) {
      allowSpace = false;
      hit.click(); // Trigger the hit button
      setTimeout(() => {
        allowSpace = true; // Re-enable space after hit animation
      }, 1000); // Adjust delay based on animation speed
    }
  });
  ///space for hit
  function checkWinner() {
    value_dealer.innerText = "Dealer value: " + String(value_dealer_cnt);
    if (value_dealer_cnt < value_player_cnt || value_dealer_cnt > 21) {
      wins = parseInt(sessionStorage.getItem("wins"));
      wins += 1;
      wins_text.innerText = "Today Wins: " + String(wins);
      sessionStorage.setItem("wins", String(wins));
    } else if (value_dealer_cnt > value_player_cnt) {
      loses = parseInt(sessionStorage.getItem("loses"));
      loses += 1;
      loses_text.innerText = "Today Loses: " + String(loses);
      sessionStorage.setItem("loses", String(loses));
    }
  }
  practice.addEventListener("click", () => {
    bustOdds_hit.classList.toggle("hidden");
    winOdds.classList.toggle("hidden");
    loseOdds.classList.toggle("hidden");
    pushOdds.classList.toggle("hidden");
    practice.blur();
  });
  function bustOddsCalculate() {
    let possibleCases = cards.length;
    if (possibleCases === 0) {
      bustOdds_hit.innerText = "Bust Odds: N/A";
      return;
    }
    let favorableCases = 0;
    for (let i = 0; i < possibleCases; i++) {
      let currentCard = cards[i];
      if (currentCard.value == "A") {
        if (aces11Involved == 0) {
          if (
            parseInt(currentCard.value1) + value_player_cnt <= 21 ||
            parseInt(currentCard.value11) + value_player_cnt <= 21
          ) {
            favorableCases++;
          }
        } else {
          favorableCases++;
        }
      } else {
        if (aces11Involved) {
          favorableCases++;
        } else if (parseInt(currentCard.value) + value_player_cnt <= 21) {
          favorableCases++;
        }
      }
    }
    let odds =
      possibleCases === 0
        ? 0
        : parseFloat((100 - (favorableCases / possibleCases) * 100).toFixed(2));
    bustOdds_hit.innerText = "Bust Odds: " + String(odds) + "%";
    console.log("Bust Odds Calculated:", odds, "%");
  }
  window.onerror = function (message, source, lineno, colno, error) {
    document.body.innerHTML += `<p style="color:red;">Error: ${message} at ${source}:${lineno}</p>`;
  };
});
