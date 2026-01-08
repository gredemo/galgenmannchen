const { useState, useEffect } = React;
const { RefreshCw, Trophy, Skull } = lucide;

const WORDS = {
  Leicht: [
    { word: 'katze', definition: 'Ein kleines pelziges Haustier, das miaut' },
    { word: 'hund', definition: 'Ein freundliches Tier, das bellt' },
    { word: 'sonne', definition: 'Der helle Stern am Himmel tagsüber' },
    { word: 'buch', definition: 'Etwas zum Lesen mit Seiten' },
    { word: 'baum', definition: 'Eine große Pflanze mit Blättern und Ästen' },
    { word: 'auto', definition: 'Ein Fahrzeug mit vier Rädern' },
    { word: 'stift', definition: 'Ein Werkzeug zum Schreiben' },
    { word: 'hut', definition: 'Etwas, das man auf dem Kopf trägt' },
    { word: 'tasse', definition: 'Ein Behälter zum Trinken' },
    { word: 'ball', definition: 'Ein rundes Objekt für Spiele' },
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
  ]
};

const HangmanGame = () => {
  const [difficulty, setDifficulty] = useState('Mittel');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [lastGuess, setLastGuess] = useState(null);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    if (gameStatus === 'won') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [gameStatus]);

  const startNewGame = () => {
    const wordList = WORDS[difficulty];
    const randomItem = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomItem.word.toLowerCase());
    setDefinition(randomItem.definition);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setShowConfetti(false);
    setLastGuess(null);
  };

  const handleLetterGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    setLastGuess(letter);

    if (!word.includes(letter)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= 10) {
        setGameStatus('lost');
      }
    } else {
      const allLettersGuessed = word.split('').every(l => newGuessedLetters.includes(l));
      if (allLettersGuessed) {
        setGameStatus('won');
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, idx) => {
      const isRevealed = guessedLetters.includes(letter);
      const isNew = lastGuess === letter && isRevealed;
      return (
        React.createElement('span', {
          key: idx,
          className: `inline-block w-10 h-12 mx-1 text-3xl font-bold border-b-4 border-amber-800 text-center transition-all duration-300 ${
            isNew ? 'text-green-700' : 'text-amber-900'
          }`,
          style: { fontFamily: 'Georgia, serif' }
        }, isRevealed ? letter.toUpperCase() : '')
      );
    });
  };

  const renderKeyboard = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzäöüß'.split('');
    return (
      React.createElement('div', { className: 'flex flex-wrap gap-1 justify-center' },
        alphabet.map(letter => {
          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);
          
          return React.createElement('button', {
            key: letter,
            onClick: () => handleLetterGuess(letter),
            disabled: isGuessed || gameStatus !== 'playing',
            className: `w-9 h-9 text-sm font-bold rounded-md transition-all duration-300 transform hover:scale-110 border-2 ${
              isCorrect
                ? 'bg-gradient-to-b from-green-600 to-green-800 text-amber-100 shadow-lg cursor-not-allowed scale-95 border-green-900'
                : isWrong
                ? 'bg-gradient-to-b from-red-700 to-red-900 text-amber-100 shadow-lg cursor-not-allowed scale-95 rotate-12 border-red-950'
                : 'bg-gradient-to-b from-amber-600 to-amber-800 text-amber-50 hover:from-amber-500 hover:to-amber-700 shadow-md hover:shadow-xl border-amber-900'
            } ${gameStatus !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`,
            style: { fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }
          }, letter.toUpperCase());
        })
      )
    );
  };

  const drawHangman = () => {
    return (
      React.createElement('svg', {
        width: '200',
        height: '250',
        className: `mx-auto transition-all duration-500 ${shake ? 'animate-shake' : ''}`
      },
        React.createElement('line', { x1: '20', y1: '230', x2: '180', y2: '230', stroke: '#000000', strokeWidth: '4' }),
        React.createElement('line', { x1: '50', y1: '230', x2: '50', y2: '20', stroke: '#000000', strokeWidth: '4' }),
        React.createElement('line', { x1: '50', y1: '20', x2: '130', y2: '20', stroke: '#000000', strokeWidth: '4' }),
        React.createElement('line', { x1: '130', y1: '20', x2: '130', y2: '50', stroke: '#000000', strokeWidth: '4' }),
        
        wrongGuesses >= 1 && React.createElement('g', { className: 'animate-fadeIn' },
          React.createElement('circle', { cx: '130', cy: '70', r: '20', stroke: '#FF6B6B', strokeWidth: '4', fill: '#FFE5E5' })
        ),
        
        wrongGuesses >= 2 && React.createElement('line', { x1: '130', y1: '90', x2: '130', y2: '150', stroke: '#FF6B6B', strokeWidth: '4', className: 'animate-fadeIn' }),
        wrongGuesses >= 3 && React.createElement('line', { x1: '130', y1: '110', x2: '100', y2: '130', stroke: '#FF6B6B', strokeWidth: '4', className: 'animate-fadeIn' }),
        wrongGuesses >= 4 && React.createElement('line', { x1: '130', y1: '110', x2: '160', y2: '130', stroke: '#FF6B6B', strokeWidth: '4', className: 'animate-fadeIn' }),
        wrongGuesses >= 5 && React.createElement('line', { x1: '130', y1: '150', x2: '110', y2: '190', stroke: '#FF6B6B', strokeWidth: '4', className: 'animate-fadeIn' }),
        wrongGuesses >= 6 && React.createElement('line', { x1: '130', y1: '150', x2: '150', y2: '190', stroke: '#FF6B6B', strokeWidth: '4', className: 'animate-fadeIn' }),
        wrongGuesses >= 7 && React.createElement('circle', { cx: '122', cy: '67', r: '3', fill: '#333', className: 'animate-fadeIn' }),
        wrongGuesses >= 8 && React.createElement('circle', { cx: '138', cy: '67', r: '3', fill: '#333', className: 'animate-fadeIn' }),
        wrongGuesses >= 9 && React.createElement('path', { d: 'M 120 78 Q 130 75 140 78', stroke: '#333', strokeWidth: '2', fill: 'none', className: 'animate-fadeIn' }),
        
        wrongGuesses >= 10 && React.createElement('g', { className: 'animate-pulse' },
          React.createElement('line', { x1: '118', y1: '64', x2: '126', y2: '70', stroke: '#DC2626', strokeWidth: '3' }),
          React.createElement('line', { x1: '126', y1: '64', x2: '118', y2: '70', stroke: '#DC2626', strokeWidth: '3' }),
          React.createElement('line', { x1: '134', y1: '64', x2: '142', y2: '70', stroke: '#DC2626', strokeWidth: '3' }),
          React.createElement('line', { x1: '142', y1: '64', x2: '134', y2: '70', stroke: '#DC2626', strokeWidth: '3' })
        )
      )
    );
  };

  return (
    React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-stone-800 via-amber-900 to-stone-900 p-4 relative overflow-hidden flex items-center justify-center' },
      React.createElement('div', { className: 'absolute inset-0 overflow-hidden pointer-events-none opacity-20' },
        React.createElement('div', {
          className: 'absolute w-full h-full',
          style: {
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }
        })
      ),

      showConfetti && React.createElement('div', { className: 'absolute inset-0 pointer-events-none' },
        [...Array(50)].map((_, i) =>
          React.createElement('div', {
            key: i,
            className: 'absolute w-3 h-3 animate-confetti',
            style: {
              left: `${Math.random() * 100}%`,
              top: '-10%',
              backgroundColor: ['#D4AF37', '#FFD700', '#CD7F32', '#C0C0C0', '#8B4513'][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }
          })
        )
      ),

      React.createElement('div', {
        className: 'w-full max-w-5xl bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg shadow-2xl p-4 relative z-10 border-8 border-amber-900',
        style: {
          boxShadow: '0 0 0 4px #78350f, 0 20px 60px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)'
        }
      },
        React.createElement('div', { className: 'text-center mb-3' },
          React.createElement('h1', {
            className: 'text-5xl font-bold bg-gradient-to-b from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent',
            style: {
              fontFamily: 'Georgia, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '0.1em'
            }
          }, '⚔ GALGENMÄNNCHEN ⚔')
        ),
        React.createElement('p', {
          className: 'text-center text-amber-900 mb-3 text-base font-semibold',
          style: { fontFamily: 'Georgia, serif' }
        }, 'Errate das Wort, bevor der Galgen deine Seele fordert!'),
        
        React.createElement('div', { className: 'flex justify-center gap-3 mb-3' },
          Object.keys(WORDS).map(level =>
            React.createElement('button', {
              key: level,
              onClick: () => setDifficulty(level),
              className: `px-6 py-2 rounded-md font-bold text-base transition-all duration-300 transform hover:scale-105 border-4 ${
                difficulty === level
                  ? 'bg-gradient-to-b from-amber-600 to-amber-800 text-amber-50 shadow-lg scale-105 border-amber-900'
                  : 'bg-gradient-to-b from-stone-300 to-stone-400 text-stone-800 hover:from-stone-400 hover:to-stone-500 shadow-md border-stone-600'
              }`,
              style: { fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }
            }, level)
          )
        ),

        React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
          React.createElement('div', {},
            React.createElement('div', { className: 'text-center mb-3' },
              React.createElement('div', { className: 'inline-block px-4 py-2 bg-gradient-to-b from-red-800 to-red-950 rounded-md shadow-lg border-4 border-red-950' },
                React.createElement('p', {
                  className: 'text-xl font-bold text-amber-100',
                  style: { fontFamily: 'Georgia, serif' }
                }, `Falsch: ${wrongGuesses}/10`)
              )
            ),

            React.createElement('div', { className: 'bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-4 shadow-inner border-4 border-amber-800' },
              drawHangman()
            )
          ),

          React.createElement('div', { className: 'flex flex-col' },
            React.createElement('div', { className: 'flex justify-center mb-3 flex-wrap' },
              renderWord()
            ),

            gameStatus === 'won' && React.createElement('div', { className: 'text-center mb-3' },
              React.createElement('div', { className: 'inline-flex items-center gap-2 bg-gradient-to-b from-green-700 to-green-900 text-amber-100 px-4 py-2 rounded-lg shadow-2xl border-4 border-green-950' },
                React.createElement(Trophy, { size: 30, className: 'text-yellow-400' }),
                React.createElement('div', { style: { fontFamily: 'Georgia, serif' } },
                  React.createElement('p', { className: 'text-2xl font-bold' }, 'SIEG!'),
                  React.createElement('p', { className: 'text-base' }, 'Wort: ',
                    React.createElement('span', { className: 'font-bold text-yellow-300' }, word.toUpperCase())
                  ),
                  React.createElement('p', { className: 'text-xs italic text-amber-200' }, `"${definition}"`)
                )
              )
            ),
            
            gameStatus === 'lost' && React.createElement('div', { className: 'text-center mb-3 animate-shake' },
              React.createElement('div', { className: 'inline-flex items-center gap-2 bg-gradient-to-b from-stone-800 to-black text-amber-100 px-4 py-2 rounded-lg shadow-2xl border-4 border-stone-950' },
                React.createElement(Skull, { size: 30, className: 'text-red-500' }),
                React.createElement('div', { style: { fontFamily: 'Georgia, serif' } },
                  React.createElement('p', { className: 'text-2xl font-bold' }, 'NIEDERLAGE!'),
                  React.createElement('p', { className: 'text-base' }, 'Wort: ',
                    React.createElement('span', { className: 'font-bold text-red-400' }, word.toUpperCase())
                  ),
                  React.createElement('p', { className: 'text-xs italic text-amber-200' }, `"${definition}"`)
                )
              )
            ),

            renderKeyboard(),

            React.createElement('div', { className: 'flex justify-center mt-3' },
              React.createElement('button', {
                onClick: startNewGame,
                className: 'flex items-center gap-2 px-6 py-2 bg-gradient-to-b from-amber-600 to-amber-800 text-amber-50 rounded-md font-bold text-base shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-amber-900',
                style: { fontFamily: 'Georgia, serif' }
              },
                React.createElement(RefreshCw, { size: 20 }),
                'Neue Quest'
              )
            )
          )
        )
      ),

      React.createElement('style', {},  `
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `)
    )
  );
};

ReactDOM.render(React.createElement(HangmanGame), document.getElementById('root'));