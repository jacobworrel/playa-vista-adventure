const haversine = {};

//gets distance between 2 coordinates on a sphere (Earth)
haversine.getDistance = (lat1, lon1, lat2, lon2) => {
  console.log('in getDistance')
    const degToRad = degrees => degrees * (Math.PI / 180);

    let earthRadiusFeet = 20903520;
    let dLat = degToRad(lat2 - lat1);
    let dLon = degToRad(lon2 - lon1);

    lat1 = degToRad(lat1);
    lat2 = degToRad(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = earthRadiusFeet * c;
    return distance;
}

  export default haversine;
