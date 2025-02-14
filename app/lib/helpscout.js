export async function fetchHelpScoutData(endpoint) {
    const res = await fetch(`https://metricapi-f7n6.onrender.com/docs#/default/${endpoint}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  }
  