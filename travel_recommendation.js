
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
  
  function renderResults(items, title = "Results") {
    const resultsEl = document.getElementById("results");
    if (!resultsEl) return;
  
    if (!items || items.length === 0) {
      resultsEl.innerHTML = `<p style="color:white; padding:20px;">No results found.</p>`;
      return;
    }
  
    const cards = items.map((it) => {
      const name = it.name || it.city || it.country || "Unknown";
      const desc = it.description || "";
      const img = it.imageUrl || "";
  
      return `
        <div style="background: rgba(0,0,0,0.55); color:white; padding:15px; border-radius:8px; margin:12px 20px; max-width:800px;">
          ${img ? `<img src="${img}" alt="${name}" style="width:100%; max-height:260px; object-fit:cover; border-radius:6px; margin-bottom:10px;">` : ""}
          <h3 style="margin-bottom:8px;">${name}</h3>
          <p style="line-height:1.5;">${desc}</p>
        </div>
      `;
    }).join("");
  
    resultsEl.innerHTML = `
      <h2 style="color:white; padding:20px 20px 0;">${title}</h2>
      ${cards}
    `;
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
    clearResults();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
  
    if (searchBtn) searchBtn.addEventListener("click", handleSearchClick);
    if (clearBtn) clearBtn.addEventListener("click", handleClearClick);
  });