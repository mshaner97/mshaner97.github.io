let game = {
    tableau: [],
    foundations: [],
    stock: [],
    waste: []
};
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.faceUp = false;
        this.id = `card-${suit}-${value}`;
    }
    flip() {
        this.faceUp = !this.faceUp;
    }
    getSuitSymbol() {
        // Convert suit name to symbol
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[this.suit];
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = `card ${this.suit}`;
        card.draggable = true;
        card.id = this.id;

        if (this.faceUp) {
            card.innerHTML = `
                <div class="cardContent">
                    <div class="card-value top-value">${this.value}</div>
                    <div class="center-suit">${this.getSuitSymbol()}</div>
                    <div class="card-value bottom-value">${this.value}</div>
                </div>
            `;
        } else {
            card.classList.add('facedown');
        }
        card.addEventListener('dragstart', this.dragStart.bind(this));
        return card;
    }
    dragStart(e) {
        const cardData= {
            id: this.id,
            suit: this.suit,
            value: this.value
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(cardData));
    }
}
// Creating the deck of cards for array sorting
class Deck {
    constructor() {
        this.cards = this.createDeck();
    }
    createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push(new Card(suit, value));
        }
    }
    return deck;
}
}
// deck shuffling
function shuffleDeck(deck) {
    for (let i = deck.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i +1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
// Dealing cards
function dealCards(deck) {
    const tableau = Array(7).fill().map(()=> []);
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            tableau[j].push(deck.pop());
        }
    }
    return tableau;
}
function flipTopCards(tableau) {
    tableau.forEach(pile => {
        if (pile.length > 0) {
            pile[pile.length - 1].flip();
        }
    });
}
function updateTableau(tableau) {
    tableau.forEach((pile, i) => {
        const pileElement = document.getElementById(`tableau-${i}`);
        pileElement.innerHTML = '';
        pile.forEach((card, index) => {
            const cardElement = card.createCardElement();
            cardElement.style.position = 'absolute';
            cardElement.style.top = `${index * 30}px`;
            cardElement.style.left = '0px';
            pileElement.appendChild(cardElement);
        });
    });
}

function updateFoundations(foundations) {
    foundations.forEach((pile, i) => {
        const pileElement = document.getElementById(`foundation-${i}`);
        pileElement.innerHTML = '';
        if (pile.length > 0) {
            pileElement.appendChild(pile[pile.length - 1].createCardElement());
        }
    });
}

function updateStock(stock) {
    const stockElement = document.getElementById('stock');
    stockElement.innerHTML = stock.length > 0 ? '<div class="card facedown"></div>' : '';
}

function updateWaste(waste) {
    const wasteElement = document.getElementById('waste');
    wasteElement.innerHTML = '';
    if (waste.length > 0) {
        wasteElement.appendChild(waste[waste.length - 1].createCardElement());
    }
}

function updateGameBoard(game) {
    updateTableau(game.tableau);
    updateFoundations(game.foundations);
    updateStock(game.stock);
    updateWaste(game.waste);
  }
// Beginning the game
function startGame() {
    const deck = new Deck().cards;
    shuffleDeck(deck);
    const tableau = dealCards(deck);
    flipTopCards(tableau);
    const stock = deck;
    const foundations = Array(4).fill().map(() => []);
    const waste = [];

    return { tableau, stock, foundations, waste };
}
function initGame() {
    game = startGame();
    updateGameBoard(game);
    console.log(game);
    setupEventListeners(game);
}
function checkWinCondition(game) {
    const isComplete = game.foundations.every(foundation => foundation.length === 13);
    if (isComplete) {
        alert('Lo hicimos, adaddadadada')
    }
}
document.addEventListener('DOMContentLoaded', initGame);
//Check if valid move for drag/drop
function isValidMove(cardData, dropZone, game) {
    if (dropZone.classList.contains('foundationDeck')) {
        const foundationIndex = parseInt(dropZone.id.split('-')[1]);
        return canMoveToFoundation(cardData, game.foundations[foundationIndex]);
    } else if (dropZone.classList.contains('tableau-pile')) {
        const tableauIndex = parseInt(dropZone.id.split('-')[1]);
        return canMoveToTableau(cardData, game.tableau[tableauIndex]);
    }
    return false;
}
//function to move the cards
function performMove(cardData, dropZone, game) {
    const sourceElement = document.getElementById(cardData.id);
    if (!sourceElement) {
        console.log('Source element not found');
        return;
    }
    const sourcePile = sourceElement.closest('.tableau-pile, .foundationDeck, #waste');
    if (!sourcePile) {
        console.log('Source pile not found');
        return;
    }

    // Remove the card from the source
    if (sourcePile.classList.contains('tableau-pile')) {
        const sourceIndex = parseInt(sourcePile.id.split('-')[1]);
        const cardIndex = game.tableau[sourceIndex].findIndex(c => c.id === cardData.id);
        if (cardIndex !== -1) {
            game.tableau[sourceIndex].splice(cardIndex, 1);
        }
    } else if (sourcePile.id === 'waste') {
        game.waste.pop();
    }

    // Add the card to the target
    if (dropZone.classList.contains('foundationDeck')) {
        const foundationIndex = parseInt(dropZone.id.split('-')[1]);
        // Create a new Card instance instead of using raw cardData
        const newCard = new Card(cardData.suit, cardData.value);
        newCard.faceUp = true;
        game.foundations[foundationIndex].push(newCard);
    } else if (dropZone.classList.contains('tableau-pile')) {
        const tableauIndex = parseInt(dropZone.id.split('-')[1]);
        // Create a new Card instance instead of using raw cardData
        const newCard = new Card(cardData.suit, cardData.value);
        newCard.faceUp = true;
        game.tableau[tableauIndex].push(newCard);
    }

    // Flip the top card of the source tableau pile if needed
    if (sourcePile.classList.contains('tableau-pile')) {
        const sourceIndex = parseInt(sourcePile.id.split('-')[1]);
        if (game.tableau[sourceIndex].length > 0) {
            game.tableau[sourceIndex][game.tableau[sourceIndex].length - 1].flip();
        }
    }

    // Update the game board
    updateGameBoard(game);
    checkWinCondition(game);
}
// Check if card can be moved to the foundation
function canMoveToFoundation(card, foundation) {
    if (foundation.length === 0) {
        return card.value === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return card.suit === topCard.suit && values.indexOf(card.value) ===
    values.indexOf(topCard.value) + 1;
}
// Check if card can be moved to the tableau
function canMoveToTableau(card, tableauPile) {
    if (tableauPile.length === 0) {
        return card.value === 'K';
    }
    const topCard = tableauPile[tableauPile.length - 1];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const redSuits = ['hearts', 'diamonds'];
  const blackSuits = ['spades', 'clubs'];
  return (
    (redSuits.includes(card.suit) && blackSuits.includes(topCard.suit)
||
    blackSuits.includes(card.suit) && redSuits.includes(topCard.suit))
&&
    values.indexOf(card.value) === values.indexOf(topCard.value) - 1
    );
}
// Ability to move cards between piles
function moveCard(fromPile, toPile, cardIndex) {
    const movedCards = fromPile.splice(cardIndex);
    toPile.push(...movedCards);

    if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
        fromPile[fromPile.length - 1].flip();
    }

    updateGameBoard(game);
}
function drawCard(game) {
    if (game.stock.length > 0) {
        const card = game.stock.pop();
        card.flip();
        game.waste.push(card);
    } else if (game.waste.length > 0) {
        game.stock = game.waste.reverse();
        game.waste = [];
        game.stock.forEach(card => card.flip());
    }
    updateGameBoard(game);
}
// function for all event listeners
function setupEventListeners(game) {
    setupTableauListeners(game);
    setupFoundationListeners(game);
    setupStockListener(game);
    setupWasteListener(game);
    setupDropZones(game);
    document.getElementById('waste').addEventListener('click', () => handleWasteCardClick(game));
}
//setting up drop zones for cards
function setupDropZones(game) {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', dragOver);
      zone.addEventListener('drop', (e) => drop(e, game));
      console.log(`Drop listener added to: ${zone.id}`);
    });
  }
function dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    console.log('Dragover event fired');
}
function dragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}
function drop(e, game) {
    e.preventDefault();
    console.log('Drop event fired');
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
    console.log('Card data:', cardData);

    const sourceElement = document.getElementById(cardData.id);
    const dropZone = e.target.closest('.tableau-pile, .foundationDeck, #waste');

    if (sourceElement && dropZone) {
        if (isValidMove(cardData, dropZone, game)) {
            performMove(cardData, dropZone, game);
            updateGameBoard(game);
        } else {
            console.log('Invalid move');
        }
    }
}
function makeCardDraggable(cardElement) {
    cardElement.setAttribute('draggable', 'true');
    cardElement.addEventListener('dragstart', dragStart);
}
// event listeners for the tableau
function setupTableauListeners(game) {
    game.tableau.forEach((pile, i) => {
        const pileElement = document.getElementById(`tableau-${i}`);
        pileElement.addEventListener('click', (e) => {
            const cardElement = e.target.closest('.card');
            if (cardElement) {
                const cardIndex =
Array.from(pileElement.children).indexOf(cardElement);
                handleTableauCardClick(game, i, cardIndex);
            }
        });
    });
}
// event listeners for foundation piles
function setupFoundationListeners(game) {
    game.foundations.forEach((pile, i) => {
        const pileElement = document.getElementById(`foundation-${i}`);
        pileElement.addEventListener('click', () => {
            handleFoundationClick(game, i);
        });
    });
}
function setupStockListener(game) {
    const stockElement = document.getElementById('stock');
    stockElement.addEventListener('click', () => {
        drawCard(game);
    });
}
function setupWasteListener(game) {
    const wasteElement = document.getElementById('waste');
    wasteElement.addEventListener('click', () => {
        if (game.waste.length > 0) {
            handleWasteCardClick(game);
        }
    });
}
// Card click handlers
function handleCardClick(event) {
    const card = event.target;
    const pile = card.closest('.pile');
    const pileIndex = parseInt(pile.dataset.index);
    const cardIndex = Array.from(pile.children).indexOf(card);
    if (pile.classList.contains('tableau')){
        handleTableauCardClick(pileIndex, cardIndex);
    } else if (pile.classList.contains('foundation')){
        handleFoundationClick(pileIndex);
    } else if (pile.classList.contains('waste')) {
        handleWasteCardClick();
    }
}
//Stock click event to decide what happens when attempting to draw cards
function handleStockClick() {
    if (game.stock.length > 0) {
        drawCard(game);
    } else {
        resetStock(game);
    }
    updateGameBoard(game);
}
function handleTableauCardClick(game, pileIndex, cardIndex) {
    const pile = game.tableau[pileIndex];
    const card = pile[cardIndex];

    if (!card.faceUp) {
        if (cardIndex === pile.length - 1) {
            card.flip();
            updateGameBoard(game);
        }
        return;
    }

    // Move to foundation only if it's the top card
    if (cardIndex === pile.length - 1) {
        for (let i = 0; i < game.foundations.length; i++) {
            if (canMoveToFoundation(card, game.foundations[i])) {
                moveCard(pile, game.foundations[i], cardIndex);
                updateGameBoard(game);
                checkWinCondition(game);
                return;
            }
        }
    }

    // Move to another tableau pile if it's a valid sequence
    const cardsToMove = pile.slice(cardIndex);
    for (let i = 0; i < game.tableau.length; i++) {
        if (i !== pileIndex && canMoveToTableau(cardsToMove[0], game.tableau[i])) {
            moveCards(pile, game.tableau[i], cardIndex);
            updateGameBoard(game);
            return;
        }
    }
}

function moveCards(fromPile, toPile, startIndex) {
    const movedCards = fromPile.splice(startIndex);
    toPile.push(...movedCards);
    if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
        fromPile[fromPile.length - 1].flip();
    }
}

function handleFoundationClick(game, pileIndex) {  
    const foundation = game.foundations[pileIndex];  
    if (foundation && foundation.length > 0) {  
        const card = foundation[foundation.length - 1];
        for (let i = 0; i < game.tableau.length; i++) {
            if (canMoveToTableau(card, game.tableau[i])) {
                moveCard(foundation, game.tableau[i], foundation.length - 1);
                updateGameBoard(game);
                break;
            }
        }
    }
}
function handleWasteCardClick() {
    if (game.waste.length > 0) {
        const card = game.waste[game.waste.length - 1];
        for (let i = 0; i < game.foundations.length; i++) {
            if (canMoveToFoundation(card, game.foundations[i])) {
                moveCard (game.waste, game.foundations[i], game.waste.length - 1);
                updateGameBoard(game);
                checkWinCondition(game);
                return;
            }
        }
        // Tableau movement for waste pile
        for (let i = 0; i < game.tableau.length; i++) {
            if (canMoveToTableau(card, game.tableau[i])) {
                moveCard(game.waste, game.tableau[i], game.waste.length - 1);
                updateGameBoard(game);
                return;
            }
        }
    }
}