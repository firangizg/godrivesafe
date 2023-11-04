function getUserLocation(callback) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        function (error) {
          console.error("Error getting location: ", error);
          callback(null);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      callback(null); 
    }
  }
  
  // A mock database of cars and their ratings
  let carRatings = {
    'car1': [5, 4, 3],
    'car2': [2, 2, 3],
    'car3': [4, 5],
    'car4': [3, 3, 3, 4],
    'car5': [5, 4, 4, 5]
  };
  
  // Function to calculate average rating
  function calculateAverageRating(ratings) {
    let sum = ratings.reduce((a, b) => a + b, 0);
    return (sum / ratings.length).toFixed(1); 
  }
  
  // Function to update the average rating for a car
  function updateAverageRating(carId, newRating) {
    if (!carRatings[carId]) {
      carRatings[carId] = [];
    }
    carRatings[carId].push(newRating);
    return calculateAverageRating(carRatings[carId]);
  }
  
  // Initialize the map and add the cars as markers
  function initializeMap() {
    getUserLocation((location) => {
      if (!location) {
        alert("Location is not available.");
      }
      let mymap = L.map('map').setView([location.lat, location.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mymap).on('load', () => {
          document.getElementById('loadingScreen').style.display = 'none'; 
      });
  
      Object.keys(carRatings).forEach(carId => {
        let carLocation = {
          lat: location.lat + (Math.random() - 0.5) * 0.02,
          lng: location.lng + (Math.random() - 0.5) * 0.02
        };
  
        let marker = L.marker([carLocation.lat, carLocation.lng]).addTo(mymap);
        marker.carId = carId;

        marker.on('click', function(e) {
          let selectedCarId = e.target.carId;
          let averageRating = calculateAverageRating(carRatings[selectedCarId]);
          let driverDetailsDiv = document.getElementById('driverDetails');
          let ratingForm = document.getElementById('ratingForm');
          
          driverDetailsDiv.innerHTML = `
              <p>Car ID: ${selectedCarId}</p>
              <p>Average Rating: ${averageRating}</p>
          `;
          
          document.getElementById('ratedDriverId').value = selectedCarId;
          ratingForm.classList.remove('hidden'); 
          document.getElementById('driverInfo').classList.remove('hidden'); 
        });      
      });
    });
  }
  
  initializeMap();
  
  document.getElementById('ratingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let driverId = document.getElementById('ratedDriverId').value;
    let selectedRating = document.getElementById('safetyRating').value;
  
    if (!carRatings[driverId]) {
      carRatings[driverId] = [];
    }
    carRatings[driverId].push(parseInt(selectedRating));
  
    let newAverageRating = calculateAverageRating(carRatings[driverId]);
    let driverDetailsDiv = document.getElementById('driverDetails');
    driverDetailsDiv.innerHTML = `
      <p>Car ID: ${driverId}</p>
      <p>Average Rating: ${newAverageRating}</p>
    `;

    alert('Rating submitted!'); 
  });
  