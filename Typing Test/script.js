const display = document.getElementById('text-display');
const input = document.getElementById('input-area');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startBtn = document.getElementById('start-btn');

const testText = `Leonardo di ser Piero da Vinci(15 April 1452 - 2 May 1519) was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor, and architect.While his fame initially rested on his achievements as a painter, he has also become known for his notebooks, in which he made drawings and notes on a variety of subjects, including anatomy, astronomy, botany, cartography, painting, and palaeontology. Leonardo is widely regarded to have been a genius who epitomised the Renaissance humanist ideal, and his collective works comprise a contribution to later generations of artists matched only by that of his younger contemporary Michelangelo`;

let time = 60;
let timer = null;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function loadText() {
  display.innerHTML = '';
  testText.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    display.appendChild(span);
  });
}

function startTest() {
  input.value = '';
  charIndex = 0;
  mistakes = 0;
  time = 60;
  isTyping = false;
  wpmDisplay.innerText = 0;
  accuracyDisplay.innerText = 100;
  timerDisplay.innerText = time;
  input.removeAttribute('disabled');
  input.focus();
  loadText();
  clearInterval(timer);
}

function updateTimer() {
  if (time > 0) {
    time--;
    timerDisplay.innerText = time;
    if (time === 0) {
      input.setAttribute('disabled', true);
      clearInterval(timer);
    }
  }
}

input.addEventListener('input', () => {
  const chars = display.querySelectorAll('span');
  const typed = input.value.split('');

  if (!isTyping) {
    isTyping = true;
    timer = setInterval(updateTimer, 1000);
  }

  chars.forEach((char, index) => {
    let typedChar = typed[index];

    if (!typedChar) {
      char.classList.remove('correct', 'incorrect');
    } else if (typedChar === char.innerText) {
      char.classList.add('correct');
      char.classList.remove('incorrect');
    } else {
      char.classList.add('incorrect');
      char.classList.remove('correct');
    }
  });

  mistakes = Array.from(chars).filter((char, index) => {
    return typed[index] && typed[index] !== char.innerText;
  }).length;

  const wordsTyped = typed.join('').trim().split(/\s+/).length;
  const timeElapsed = 60 - time;
  const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
  const totalChars = typed.length;
  const accuracy = totalChars ? Math.max(0, Math.round(((totalChars - mistakes) / totalChars) * 100)) : 100;

  wpmDisplay.innerText = wpm;
  accuracyDisplay.innerText = accuracy;
});

startBtn.addEventListener('click', startTest);

// Load initial text on page load
loadText();
