
let travelData = null;

async function loadTravelData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    travelData = await response.json();

    console.log("Datos cargados desde JSON:", travelData);

  } catch (error) {
    console.error("Error cargando travel_recommendation_api.json:", error);
  }
}

loadTravelData();
function normalizeKeyword(raw) {
    let k = (raw || "").trim().toLowerCase();
    if (k.endsWith("s")) k = k.slice(0, -1);
  
    return k;
  }
  
  function getCategoryFromKeyword(raw) {
    const k = normalizeKeyword(raw);
  
    const beachKeywords = ["playa", "beach"];
    const templeKeywords = ["templo", "temple"];
    const countryKeywords = ["pais", "país", "country"];
  
    if (beachKeywords.includes(k)) return "beaches";
    if (templeKeywords.includes(k)) return "temples";
    if (countryKeywords.includes(k)) return "countries";
  
    return "any";
  }
  
  function clearResults() {
    const resultsEl = document.getElementById("results");
    if (resultsEl) resultsEl.innerHTML = "";
  }
  
  function renderResults(items, title = "") {
    const resultsEl = document.getElementById("results");
    if (!resultsEl) return;
  
    const list = (items || []).slice(0, 2);
  
    if (list.length === 0) {
      resultsEl.innerHTML = `<div class="results-empty">Please enter a valid search query.</div>`;
      return;
    }
  
    resultsEl.innerHTML = list.map((it) => {
      const name = it.name || it.city || it.country || "Destination";
      const desc = it.description || "No description available.";
      const img = it.imageUrl || "";
  
      return `
        <div class="result-card">
          ${img ? `<img src="${img}" alt="${name}">` : ""}
          <div class="card-body">
            <h3>${name}</h3>
            <p>${desc}</p>
            <a class="visit-btn" href="#" onclick="return false;">Visit</a>
          </div>
        </div>
      `;
    }).join("");
  }
  
  
  function handleSearchClick() {
    if (!travelData) {
      console.warn("⚠️ Aún no cargan los datos. Intenta de nuevo en un momento.");
      return;
    }
  
    const inputEl = document.getElementById("searchInput");
    const queryRaw = inputEl ? inputEl.value : "";
    const queryNormalized = normalizeKeyword(queryRaw);
  
    if (!queryNormalized) {
      renderResults([], "Please enter a valid search query.");
      return;
    }
  
    const category = getCategoryFromKeyword(queryRaw);
  
    if (category === "beaches") {
      renderResults(travelData.beaches || [], "Beaches");
      return;
    }
  
    if (category === "temples") {
      renderResults(travelData.temples || [], "Temples");
      return;
    }
  
    if (category === "countries") {
      renderResults(travelData.countries || [], "Countries");
      return;
    }
  
    const pools = []
      .concat(travelData.beaches || [])
      .concat(travelData.temples || [])
      .concat(travelData.countries || []);
  
    const matches = pools.filter((item) => {
      const haystack = [
        item.name,
        item.city,
        item.country
      ].filter(Boolean).join(" ").toLowerCase();
  
      return haystack.includes(queryNormalized);
    });
  
    renderResults(matches, `Results for "${queryRaw.trim()}"`);
  }
  
  function handleClearClick() {
    const inputEl = document.getElementById("searchInput");
    if (inputEl) inputEl.value = "";
    document.getElementById("results").innerHTML = "";
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
  
    if (searchBtn) searchBtn.addEventListener("click", handleSearchClick);
    if (clearBtn) clearBtn.addEventListener("click", handleClearClick);
  });