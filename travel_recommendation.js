
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
