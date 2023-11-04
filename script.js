// Assuming you have Leaflet.js included in your project

// A mock function to simulate getting user's location
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
      callback(null); // Handle error or provide fallback location
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
    return (sum / ratings.length).toFixed(1); // One decimal place
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
      // Initialize the map on the "map" div with a given center and zoom
      let mymap = L.map('map').setView([location.lat, location.lng], 13);
      
      // Add a tile layer to add to our map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mymap);
  
      // Adding sample cars to the map at random locations near the user
      Object.keys(carRatings).forEach(carId => {
        let carLocation = {
          lat: location.lat + (Math.random() - 0.5) * 0.02,
          lng: location.lng + (Math.random() - 0.5) * 0.02
        };
  
        let marker = L.marker([carLocation.lat, carLocation.lng]).addTo(mymap);
        marker.carId = carId; // Assign the car ID to the marker for later reference
  
        // Add click event to marker
        marker.on('click', function(e) {
            let selectedCarId = e.target.carId;
            let averageRating = calculateAverageRating(carRatings[selectedCarId]);
            let driverDetailsDiv = document.getElementById('driverDetails');
            let ratingForm = document.getElementById('ratingForm');
            
            // Display driver information and rating
            driverDetailsDiv.innerHTML = `
                <p>Car ID: ${selectedCarId}</p>
                <p>Average Rating: ${averageRating}</p>
            `;
            
            // Prepare and show the rating form
            document.getElementById('ratedDriverId').value = selectedCarId;
            ratingForm.style.display = 'block'; // Show the form
          });
      });
    });
  }
  
  // Call to initialize the map
  initializeMap();
  
  // Function to handle the submission of a rating
  document.getElementById('ratingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let driverId = document.getElementById('ratedDriverId').value;
    let selectedRating = document.getElementById('safetyRating').value;
  
    // Add the rating to the carRatings array (you may need to handle this differently based on how you store ratings)
    if (!carRatings[driverId]) {
      carRatings[driverId] = [];
    }
    carRatings[driverId].push(parseInt(selectedRating));
  
    // Update the displayed average rating
    let newAverageRating = calculateAverageRating(carRatings[driverId]);
    let driverDetailsDiv = document.getElementById('driverDetails');
    driverDetailsDiv.innerHTML = `
      <p>Car ID: ${driverId}</p>
      <p>Average Rating: ${newAverageRating}</p>
    `;
  
    // Optionally hide the form again or give a confirmation of submission
    alert('Rating submitted!'); // Or update the UI to show confirmation
    // ratingForm.style.display = 'none'; // Hide the form
  });
  
  // Add any additional JavaScript here