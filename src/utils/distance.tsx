// We would normaly get the distance from the maps api
// but for now fake it till you make it
const DISTANCE_MULTIPLIER = 1.4;

export const calculateDistance = (
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string,
) => {
  const R = 6371;
  const dLat = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180;
  const dLon = ((parseFloat(lon2) - parseFloat(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((parseFloat(lat1) * Math.PI) / 180) *
      Math.cos((parseFloat(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * DISTANCE_MULTIPLIER;
};

export const calculateFuelConsumption = (
  consumption: number,
  distance: number,
) => (consumption / 100) * distance;

export const getFuelPrice = () => 1.85;

export const extraCosts = () =>
  1000 / // mean cost of car maintenance excluding fuel per year
  365 /
  2; // two trips per day
