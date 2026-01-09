// Word lists
const WORDS = {
  Leicht: [
    { word: 'Reise', definition: 'resa' },
    { word: 'reisen', definition: 'resa' },
    { word: 'sonne', definition: 'sol' },
    { word: 'buchen', definition: 'boka' },
    { word: 'Flugzeug', definition: 'flygplan' },
    { word: 'fliegen', definition: 'flyga' },
    { word: 'Bahnhof', definition: 'tågstation' },
    { word: 'Fahrkarte', definition: 'biljett' },
    { word: 'Koffer', definition: 'resväska' },
    { word: 'Verspätung', definition: 'försening' },
    { word: 'Bett', definition: 'säng' },
    { word: 'packen', definition: 'packa' },
    { word: 'Hotel', definition: 'Hotell' },
    { word: 'übernachten', definition: 'övernatta' },
    { word: 'ankommen', definition: 'anlända' },
    { word: 'abfahren', definition: 'avgå' },
    { word: 'Reisepass', definition: 'resepass' },
    { word: 'besichtigen', definition: 'besöka sevärdheter' },
  ],
  Mittel: [
    { word: 'garten', definition: 'Ein Außenbereich, in dem Pflanzen und Blumen wachsen' },
    { word: 'computer', definition: 'Ein elektronisches Gerät zum Arbeiten und Surfen im Internet' },
    { word: 'lehrer', definition: 'Eine Person, die Schüler in der Schule unterrichtet' },
    { word: 'fenster', definition: 'Eine Öffnung in einer Wand, die Licht hereinlässt' },
    { word: 'küche', definition: 'Der Raum, in dem Essen zubereitet wird' },
    { word: 'affe', definition: 'Ein verspieltes Tier, das von Bäumen schwingt' },
    { word: 'regenschirm', definition: 'Ein Objekt, das vor Regen schützt' },
    { word: 'bild', definition: 'Ein Foto oder eine Zeichnung' },
    { word: 'bruder', definition: 'Ein männliches Geschwisterkind' },
    { word: 'huhn', definition: 'Ein Bauernhoftier, das Eier legt' },
    { word: 'berg', definition: 'Eine sehr hohe natürliche Erhebung' },
    { word: 'bibliothek', definition: 'Ein Gebäude, in dem Bücher zum Lesen aufbewahrt werden' },
    { word: 'krankenhaus', definition: 'Ein Ort, an dem kranke Menschen medizinische Versorgung erhalten' },
    { word: 'schmetterling', definition: 'Ein buntes fliegendes Insekt mit großen Flügeln' },
    { word: 'fahrrad', definition: 'Ein zweirädriges Fahrzeug, das man mit Pedalen fährt' }
  ],
  Schwer: [
    { word: 'absurd', definition: 'Etwas völlig Unvernünftiges oder Unlogisches' },
    { word: 'großartig', definition: 'Äußerst schön oder beeindruckend' },
    { word: 'psychologisch', definition: 'Im Zusammenhang mit dem Geist und mentalen Prozessen' },
    { word: 'außergewöhnlich', definition: 'Sehr ungewöhnlich oder bemerkenswert' },
    { word: 'philosophie', definition: 'Das Studium grundlegender Fragen über Existenz und Wissen' },
    { word: 'architektur', definition: 'Die Kunst und Wissenschaft des Gebäudeentwurfs' },
    { word: 'demokratie', definition: 'Ein Regierungssystem durch das Volk' },
    { word: 'hypothese', definition: 'Eine vorgeschlagene Erklärung, die weitere Untersuchung erfordert' },
    { word: 'literatur', definition: 'Schriftliche Werke von künstlerischem Wert' },
    { word: 'phänomen', definition: 'Eine bemerkenswerte oder beobachtbare Tatsache oder Ereignis' },
    { word: 'zwiespältig', definition: 'Mehr als eine mögliche Bedeutung habend' },
    { word: 'anonym', definition: 'Ohne bekannten Namen oder Identität' },
    { word: 'umstand', definition: 'Eine Bedingung oder Tatsache, die eine Situation beeinflusst' },
    { word: 'zusammenarbeiten', definition: 'Gemeinsam mit anderen arbeiten' },
    { word: 'konsequenz', definition: 'Ein Ergebnis oder eine Auswirkung einer Handlung' }
  ]
};

// Game state
let currentDifficulty = 'Mittel';
let currentWord = '';
let currentDefinition = '';
let guessedLetters = [];
let wrongGuesses = 0;
let gameStatus = 'playing'; // 'playing', 'won', 'lost'
const alphabet = 'abcdefghijklmnopqrstuvwxyzäöüß';

// Initialize game
function init() {
  createKeyboard();
  setupDifficultyButtons();
  startNewGame();
}

// Create keyboard
function createKeyboard() {
  const keyboard = document.getElementById('keyboard');
  keyboard.innerHTML = '';
  
  for (let letter of alphabet) {
    const key = document.createElement('button');
    key.className = 'key';
    key.textContent = letter.toUpperCase();
    key.onclick = () => handleGuess(letter);
    key.dataset.letter = letter;
    keyboard.appendChild(key);
  }
}

// Setup difficulty buttons
function setupDifficultyButtons() {
  const buttons = document.querySelectorAll('.difficulty-btn');
  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = btn.dataset.difficulty;
      startNewGame();
    };
  });
}

// Start new game
function startNewGame() {
  const wordList = WORDS[currentDifficulty];
  const randomItem = wordList[Math.floor(Math.random() * wordList.length)];
  
  currentWord = randomItem.word.toLowerCase();
  currentDefinition = randomItem.definition;
  guessedLetters = [];
  wrongGuesses = 0;
  gameStatus = 'playing';
  
  updateDisplay();
  resetKeyboard();
  resetHangman();
  hideStatusMessage();
}

// Handle letter guess
function handleGuess(letter) {
  if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
    return;
  }
  
  guessedLetters.push(letter);
  
  const key = document.querySelector(`[data-letter="${letter}"]`);
  key.disabled = true;
  
  if (currentWord.includes(letter)) {
    key.classList.add('correct');
    updateWordDisplay();
    checkWin();
  } else {
    key.classList.add('wrong');
    wrongGuesses++;
    updateHangman();
    checkLoss();
  }
  
  document.getElementById('wrongCount').textContent = wrongGuesses;
}

// Update word display
function updateWordDisplay() {
  const wordDisplay = document.getElementById('wordDisplay');
  wordDisplay.innerHTML = '';
  
  for (let letter of currentWord) {
    const letterBox = document.createElement('div');
    letterBox.className = 'letter-box';
    
    if (guessedLetters.includes(letter)) {
      letterBox.textContent = letter.toUpperCase();
      // Check if this was the last guessed letter
      if (guessedLetters[guessedLetters.length - 1] === letter) {
        letterBox.classList.add('new');
      }
    }
    
    wordDisplay.appendChild(letterBox);
  }
}

// Update display
function updateDisplay() {
  updateWordDisplay();
  document.getElementById('wrongCount').textContent = wrongGuesses;
}

// Reset keyboard
function resetKeyboard() {
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    key.disabled = false;
    key.classList.remove('correct', 'wrong');
  });
}

// Hangman parts
const hangmanParts = [
  'head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg',
  'leftEye', 'rightEye', 'frown', 'deadEyes'
];

// Reset hangman
function resetHangman() {
  hangmanParts.forEach(part => {
    const element = document.getElementById(part);
    if (element) {
      element.style.display = 'none';
    }
  });
}

// Update hangman
function updateHangman() {
  if (wrongGuesses > 0 && wrongGuesses <= hangmanParts.length) {
    const part = document.getElementById(hangmanParts[wrongGuesses - 1]);
    if (part) {
      part.style.display = 'block';
    }
  }
}

// Check win
function checkWin() {
  const allLettersGuessed = currentWord.split('').every(letter => guessedLetters.includes(letter));
  
  if (allLettersGuessed) {
    gameStatus = 'won';
    showStatusMessage('won');
    disableKeyboard();
  }
}

// Check loss
function checkLoss() {
  if (wrongGuesses >= 10) {
    gameStatus = 'lost';
    showStatusMessage('lost');
    disableKeyboard();
    revealWord();
  }
}

// Reveal word (when lost)
function revealWord() {
  const wordDisplay = document.getElementById('wordDisplay');
  wordDisplay.innerHTML = '';
  
  for (let letter of currentWord) {
    const letterBox = document.createElement('div');
    letterBox.className = 'letter-box';
    letterBox.textContent = letter.toUpperCase();
    letterBox.style.color = '#b91c1c';
    wordDisplay.appendChild(letterBox);
  }
}

// Show status message
function showStatusMessage(status) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.className = `status-message ${status} show`;
  
  if (status === 'won') {
    statusMessage.innerHTML = `
      <h2>🏆 SIEG!</h2>
      <p>Wort: <span class="status-word">${currentWord.toUpperCase()}</span></p>
      <p class="status-definition">"${currentDefinition}"</p>
    `;
  } else {
    statusMessage.innerHTML = `
      <h2>💀 NIEDERLAGE!</h2>
      <p>Wort: <span class="status-word">${currentWord.toUpperCase()}</span></p>
      <p class="status-definition">"${currentDefinition}"</p>
    `;
  }
}

// Hide status message
function hideStatusMessage() {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.className = 'status-message';
}

// Disable keyboard
function disableKeyboard() {
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    key.disabled = true;
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);