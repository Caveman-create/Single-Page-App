const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const results = document.getElementById("results");
const errorBox = document.getElementById("error");

form.addEventListener("submit", handleSearch);

async function handleSearch(e) {
  e.preventDefault();

  const word = input.value.trim();

  // reset UI every search
  results.innerHTML = "";
  errorBox.textContent = "";

  if (!word) {
    showError("Please enter a word to search.");
    return;
  }

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!res.ok) {
      throw new Error("Word not found. Try another search.");
    }

    const data = await res.json();
    displayWord(data[0]);

  } catch (err) {
    showError(err.message);
  }
}

function displayWord(data) {
  const word = data.word;
  const meaning = data.meanings?.[0];
  const definition = meaning?.definitions?.[0]?.definition || "No definition available";
  const partOfSpeech = meaning?.partOfSpeech || "N/A";

  const audio = data.phonetics?.find(p => p.audio)?.audio;

  results.innerHTML = `
    <div class="card">
      <h2>${word}</h2>

      <p class="pos"><strong>Part of Speech:</strong> ${partOfSpeech}</p>

      <p class="definition">
        <strong>Definition:</strong><br/>
        ${definition}
      </p>

      ${audio ? `
        <div class="audio">
          <audio controls src="${audio}"></audio>
        </div>
      ` : ""}
    </div>
  `;
}

function showError(message) {
  errorBox.textContent = message;
}