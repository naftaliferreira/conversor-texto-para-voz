// Obter referências para os elementos do DOM
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const readButton = document.getElementById('read-button');
const themeToggle = document.getElementById('theme-toggle'); // Novo

// Acessar a API de síntese de fala do navegador
const synthesis = window.speechSynthesis;
let voices = [];

// --- Lógica do Modo Noturno (NOVO) ---
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️'; // Altera o ícone para sol
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
}

// Carregar o tema salvo quando a página carregar
document.addEventListener('DOMContentLoaded', loadTheme);

// Adicionar evento de clique para alternar o tema
themeToggle.addEventListener('click', toggleTheme);

// --- Lógica da Web Speech API (EXISTENTE) ---
function populateVoiceList() {
    voices = synthesis.getVoices().filter(voice => voice.lang.startsWith('pt') || voice.lang.startsWith('en'));
    voiceSelect.innerHTML = '';
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

if (synthesis.onvoiceschanged !== undefined) {
    synthesis.onvoiceschanged = populateVoiceList;
}

populateVoiceList();

readButton.addEventListener('click', () => {
    if (textInput.value !== '') {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        synthesis.speak(utterance);
    }
});