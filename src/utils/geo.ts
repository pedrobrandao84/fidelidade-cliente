export const distance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return Math.sqrt(dLat * dLat + dLng * dLng);
};
