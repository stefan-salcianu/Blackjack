from flask import Flask, jsonify, request
from flask_cors import CORS  # ✅ Import Flask-CORS
import json
import random
import os


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Load the deck from JSON (2 full decks)
def load_deck():
    with open("blackjack.json", "r") as file:
        deck_data = json.load(file)
    return deck_data["cards"] * 2  # Two full decks

# Initialize deck and tracking
deck = load_deck()
dealt_cards = []  # Track dealt cards separately

# API to receive and remove dealt cards from the deck
@app.route("/", methods=["GET"])
def home():
     print("cox")
     return jsonify({"message": "Hello from the server!"})  # ✅ Always return a response

@app.route("/remove_dealt_cards", methods=["POST"])
def remove_dealt_cards():
    global deck, dealt_cards
    data = request.json  # Expecting a JSON list of dealt cards

    for card in data["dealt_cards"]:
        for d in deck:
            if d["suit"] == card["suit"] and d["value"] == card["value"]:
                deck.remove(d)
                dealt_cards.append(d)
                break  # Remove only one instance per card

    return jsonify({"message": "Dealt cards removed", "remaining_cards": len(deck)})

# API to reset the deck (if needed)
@app.route("/reset_deck", methods=["POST"])
def reset_deck():
    global deck, dealt_cards
    deck = load_deck()  # Reload the deck
    dealt_cards = []  # Clear the dealt cards
    return jsonify({"message": "Deck reset successfully", "remaining_cards": len(deck)})

# Simulate 10,000 games based on the remaining deck
def calculate_hand_value(hand):
    """Calculate the best value of a hand, properly handling Aces."""
    total = 0
    ace_count = 0

    for card in hand:
        if isinstance(card, str):
            print(f"⚠️ Warning: Unexpected string in hand: {card}")  # Debugging
            continue  # Skip invalid data

        value = card.get("value")  # ✅ Use .get() to avoid KeyError

        if value == "A":
            ace_count += 1
            total += 11  # Assume Ace as 11 initially
        else:
            try:
                total += int(value)  # ✅ Convert numbers properly
            except ValueError:
                print(f"⚠️ Error: Invalid card value - {value}")  # Debugging
                continue  # Skip this card

    # Convert Aces from 11 to 1 if needed
    while total > 21 and ace_count > 0:
        total -= 10
        ace_count -= 1

    return total


def run_simulation(player_hand, dealer_card, num_simulations=10000):
    """Simulates 10,000 rounds and calculates win, push, and loss probabilities."""
    global deck

    wins, pushes, losses = 0, 0, 0

    for _ in range(num_simulations):
        # **STEP 1: Create a fresh deck copy**
        sim_deck = deck[:]  # Copy deck without modifying global state
        random.shuffle(sim_deck)

        # **STEP 2: Ensure the deck has enough cards to simulate**
        if len(sim_deck) < 10:
            break

        # **STEP 3: Setup player and dealer hands**
        sim_player_hand = player_hand[:]
        sim_dealer_hand = [dealer_card]

        # **STEP 4: Dealer logic (hitting on soft 17, stopping on 17+)**
        while True:
            dealer_total = calculate_hand_value(sim_dealer_hand)

            if dealer_total > 21:
                break  # Dealer busts
            elif dealer_total >= 17:
                # If dealer has a soft 17, they must hit
                if any(card["value"] == "A" for card in sim_dealer_hand) and dealer_total == 17:
                    sim_dealer_hand.append(sim_deck.pop(0))  # Dealer hits
                else:
                    break  # Dealer stands
            else:
                sim_dealer_hand.append(sim_deck.pop(0))

        # **STEP 5: Simulate Player’s Strategy (Basic)**
        while calculate_hand_value(sim_player_hand) < 17:
            sim_player_hand.append(sim_deck.pop(0))

        # **STEP 6: Calculate the final hand values**
        player_total = calculate_hand_value(sim_player_hand)
        dealer_total = calculate_hand_value(sim_dealer_hand)

        # **STEP 7: Determine outcome correctly**
        if player_total > 21:  # Player busts
            losses += 1
        elif dealer_total > 21 or player_total > dealer_total:  # Dealer busts or player wins
            wins += 1
        elif player_total == dealer_total:  # Push scenario (properly handled now)
            pushes += 1
        else:  # Dealer wins
            losses += 1

    return wins, pushes, losses


# API to get winning odds based on the current available deck
@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.json
    player_hand = data.get("player_hand", [])
    dealer_card = data.get("dealer_card", {})

    # 🛠️ Fix: Ensure dealer_card is a dictionary
    if isinstance(dealer_card, str):
        print(f"⚠️ Warning: dealer_card is a string! Converting: {dealer_card}")
        dealer_card = {"suit": "unknown", "value": dealer_card}

    if not isinstance(dealer_card, dict) or "value" not in dealer_card:
        return jsonify({"error": "Invalid dealer card format"}), 400

    if len(deck) < 10:
        return jsonify({"error": "Not enough cards left to simulate"}), 400

    win_count, push_count, loss_count = run_simulation(player_hand, dealer_card, num_simulations=10000)

    return jsonify({
        "probabilities": {
            "win_percentage": round((win_count / 10000) * 100, 2),
            "push_percentage": round((push_count / 10000) * 100, 2),
            "loss_percentage": round((loss_count / 10000) * 100, 2),
        }
    })

# Run the Flask app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Get port from Railway, default to 5000
    app.run(host="0.0.0.0", port=port)  # Expose app publicly
