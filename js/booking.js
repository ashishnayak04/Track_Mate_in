/**
 * Booking Module
 */
const BookingManager = (() => {
  // DOM elements - Booking view
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  const departDateInput = document.getElementById('departDate');
  const classSelect = document.getElementById('class');
  const passengersSelect = document.getElementById('passengers');
  const searchTrainsBtn = document.getElementById('searchTrains');
  const trainResults = document.getElementById('trainResults');
  const trainsList = document.getElementById('trainsList');
  const passengerDetails = document.getElementById('passengerDetails');
  const passengerForms = document.getElementById('passengerForms');
  const backToTrainsBtn = document.getElementById('backToTrains');
  const confirmBookingBtn = document.getElementById('confirmBooking');
  const bookingBackBtn = document.getElementById('bookingBackBtn');

  // Current booking state
  let currentBooking = {
    train: null,
    class: null,
    date: null,
    from: null,
    to: null,
    passengers: []
  };

  // Initialize date input with tomorrow's date
  const initializeDateInput = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    departDateInput.value = `${year}-${month}-${day}`;
    departDateInput.min = `${year}-${month}-${day}`;
  };

  // Search for trains based on form criteria
  const searchTrains = () => {
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    const date = departDateInput.value;
    
    // Validate inputs
    if (!from) {
      Validator.showError(fromInput, 'Please enter departure station');
      return;
    } else {
      Validator.clearError(fromInput);
    }
    
    if (!to) {
      Validator.showError(toInput, 'Please enter arrival station');
      return;
    } else {
      Validator.clearError(toInput);
    }
    
    if (!date) {
      Validator.showError(departDateInput, 'Please select a date');
      return;
    } else {
      Validator.clearError(departDateInput);
    }
    
    // Save current search criteria
    currentBooking.from = from;
    currentBooking.to = to;
    currentBooking.date = date;
    
    // Show loading spinner
    ViewManager.showLoading();
    
    // Simulate API call to fetch trains
    setTimeout(() => {
      const allTrains = DB.getAll(DB.KEYS.TRAINS);
      
      // Filter trains matching criteria
      // In a real app, this would be done server-side
      let matchedTrains = allTrains.filter(train => {
        const fromMatch = train.from.toLowerCase().includes(from.toLowerCase());
        const toMatch = train.to.toLowerCase().includes(to.toLowerCase());
        return fromMatch && toMatch;
      });
      
      // Display results
      displayTrainResults(matchedTrains);
      
      ViewManager.hideLoading();
    }, 800);
  };

  // Display train search results
  const displayTrainResults = (trains) => {
    trainsList.innerHTML = '';
    
    if (trains.length === 0) {
      trainsList.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
          <p>No trains found for this route</p>
          <p>Try different stations or dates</p>
        </div>
      `;
    } else {
      trains.forEach(train => {
        const trainCard = document.createElement('div');
        trainCard.className = 'train-card';
        trainCard.dataset.trainId = train.id;
        
        const classesHtml = train.classes.map(cls => {
          const availability = cls.available > 10 
            ? 'available' 
            : cls.available > 0 ? 'waiting' : '';
          
          return `<span class="class-badge ${availability}">${cls.code}</span>`;
        }).join('');
        
        trainCard.innerHTML = `
          <div class="train-header">
            <div>
              <div class="train-name">${train.name}</div>
              <div class="train-number">#${train.number}</div>
            </div>
            <div class="train-days">
              ${train.days.map(day => `<span class="day-badge">${day}</span>`).join(' ')}
            </div>
          </div>
          
          <div class="train-timing">
            <div class="train-time">
              <span class="time">${train.departureTime}</span>
              <span class="station">${train.from}</span>
            </div>
            
            <div class="duration">
              <span class="duration-time">${train.duration}</span>
              <span class="duration-distance">${train.distance}</span>
            </div>
            
            <div class="train-time">
              <span class="time">${train.arrivalTime}</span>
              <span class="station">${train.to}</span>
            </div>
          </div>
          
          <div class="train-details">
            <div class="train-classes">
              ${classesHtml}
            </div>
            <div class="train-price">
              From ₹${Math.min(...train.classes.map(c => c.price))}
            </div>
          </div>
          
          <button class="btn primary select-seats-btn">Select Seats</button>
        `;
        
        // Add event listener for selecting train
        trainCard.querySelector('.select-seats-btn').addEventListener('click', () => {
          selectTrain(train);
        });
        
        trainsList.appendChild(trainCard);
      });
    }
    
    // Show results section
    trainResults.classList.remove('hidden');
    passengerDetails.classList.add('hidden');
  };

  // Handle train selection
  const selectTrain = (train) => {
    currentBooking.train = train;
    
    // Get selected class if any
    const selectedClass = classSelect.value;
    if (selectedClass) {
      currentBooking.class = train.classes.find(c => c.code === selectedClass) || train.classes[0];
    } else {
      currentBooking.class = train.classes[0];
    }
    
    // Get number of passengers
    const numPassengers = parseInt(passengersSelect.value) || 1;
    
    // Generate passenger forms
    generatePassengerForms(numPassengers);
    
    // Show passenger details section
    trainResults.classList.add('hidden');
    passengerDetails.classList.remove('hidden');
  };

  // Generate passenger forms based on number of passengers
  const generatePassengerForms = (count) => {
    passengerForms.innerHTML = '';
    currentBooking.passengers = [];
    
    for (let i = 1; i <= count; i++) {
      const passengerId = `passenger-${i}`;
      
      const passengerForm = document.createElement('div');
      passengerForm.className = 'passenger-form';
      passengerForm.innerHTML = `
        <div class="passenger-form-header">
          <div class="passenger-number">Passenger ${i}</div>
        </div>
        
        <div class="passenger-form-body">
          <div class="form-group">
            <label for="${passengerId}-name">Full Name</label>
            <input type="text" id="${passengerId}-name" placeholder="Enter passenger name">
          </div>
          
          <div class="form-group">
            <label for="${passengerId}-age">Age</label>
            <input type="number" id="${passengerId}-age" placeholder="Enter age" min="1" max="120">
          </div>
          
          <div class="form-group">
            <label>Gender</label>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="${passengerId}-male" name="${passengerId}-gender" value="male" checked>
                <label for="${passengerId}-male">Male</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="${passengerId}-female" name="${passengerId}-gender" value="female">
                <label for="${passengerId}-female">Female</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="${passengerId}-berth">Preferred Berth</label>
            <select id="${passengerId}-berth">
              <option value="no-preference">No Preference</option>
              <option value="lower">Lower</option>
              <option value="middle">Middle</option>
              <option value="upper">Upper</option>
              <option value="side-lower">Side Lower</option>
              <option value="side-upper">Side Upper</option>
            </select>
          </div>
        </div>
      `;
      
      passengerForms.appendChild(passengerForm);
    }
  };

  // Collect passenger data from forms
  const collectPassengerData = () => {
    const forms = passengerForms.querySelectorAll('.passenger-form');
    const passengers = [];
    let isValid = true;
    
    forms.forEach((form, index) => {
      const nameInput = form.querySelector(`#passenger-${index+1}-name`);
      const ageInput = form.querySelector(`#passenger-${index+1}-age`);
      const genderInput = form.querySelector(`input[name="passenger-${index+1}-gender"]:checked`);
      const berthInput = form.querySelector(`#passenger-${index+1}-berth`);
      
      // Validate
      const nameError = Validator.fullName(nameInput.value);
      const ageError = Validator.age(ageInput.value);
      
      if (nameError) {
        Validator.showError(nameInput, nameError);
        isValid = false;
      } else {
        Validator.clearError(nameInput);
      }
      
      if (ageError) {
        Validator.showError(ageInput, ageError);
        isValid = false;
      } else {
        Validator.clearError(ageInput);
      }
      
      passengers.push({
        name: nameInput.value,
        age: parseInt(ageInput.value),
        gender: genderInput ? genderInput.value : 'male',
        berth: berthInput.value,
        seatNumber: `${currentBooking.class.code}-${Math.floor(Math.random() * 70) + 1}`,
        coach: `${currentBooking.class.code}${Math.floor(Math.random() * 5) + 1}`
      });
    });
    
    if (isValid) {
      currentBooking.passengers = passengers;
      return true;
    }
    
    return false;
  };

  // Confirm booking and process
  const confirmBooking = () => {
    // Check if logged in
    if (!DB.getCurrentUser()) {
      ViewManager.showToast('Please login to continue booking', 'error');
      ViewManager.showLogin();
      return;
    }
    
    // Collect and validate passenger data
    if (!collectPassengerData()) {
      Validator.shakeForm(passengerForms);
      return;
    }
    
    // Show loading
    ViewManager.showLoading();
    
    // Simulate booking processing
    setTimeout(() => {
      const user = DB.getCurrentUser();
      
      // Create booking object
      const booking = {
        id: DB.generateId(),
        pnr: DB.generatePNR(),
        userId: user.id,
        trainId: currentBooking.train.id,
        trainNumber: currentBooking.train.number,
        trainName: currentBooking.train.name,
        from: currentBooking.from,
        to: currentBooking.to,
        departureDate: currentBooking.date,
        departureTime: currentBooking.train.departureTime,
        arrivalTime: currentBooking.train.arrivalTime,
        class: currentBooking.class.code,
        classname: currentBooking.class.name,
        fare: currentBooking.class.price * currentBooking.passengers.length,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        passengers: currentBooking.passengers
      };
      
      // Save booking to database
      DB.add(DB.KEYS.BOOKINGS, booking);
      
      // Update train availability
      const trains = DB.getAll(DB.KEYS.TRAINS);
      const trainIndex = trains.findIndex(t => t.id === currentBooking.train.id);
      
      if (trainIndex !== -1) {
        const classIndex = trains[trainIndex].classes.findIndex(c => c.code === currentBooking.class.code);
        
        if (classIndex !== -1) {
          trains[trainIndex].classes[classIndex].available -= currentBooking.passengers.length;
          DB.save(DB.KEYS.TRAINS, trains);
        }
      }
      
      ViewManager.hideLoading();
      
      // Show success message
      ViewManager.showToast('Booking confirmed successfully!', 'success');
      
      // Redirect to user dashboard
      ViewManager.showUser();
    }, 1500);
  };

  // Handle back button in booking flow
  const handleBackButton = () => {
    // If showing passenger details, go back to train results
    if (!passengerDetails.classList.contains('hidden')) {
      trainResults.classList.remove('hidden');
      passengerDetails.classList.add('hidden');
      return;
    }
    
    // If showing train results, go back to search form
    if (!trainResults.classList.contains('hidden')) {
      trainResults.classList.add('hidden');
      return;
    }
    
    // Otherwise, go back to previous view
    if (DB.getCurrentUser()) {
      if (DB.isAdmin()) {
        ViewManager.showAdmin();
      } else {
        ViewManager.showUser();
      }
    } else {
      ViewManager.showLogin();
    }
  };

  // Initialize booking module
  const init = () => {
    // Initialize date input
    initializeDateInput();
    
    // Event listeners
    searchTrainsBtn.addEventListener('click', searchTrains);
    backToTrainsBtn.addEventListener('click', () => {
      trainResults.classList.remove('hidden');
      passengerDetails.classList.add('hidden');
    });
    
    confirmBookingBtn.addEventListener('click', confirmBooking);
    bookingBackBtn.addEventListener('click', handleBackButton);
    
    // User dashboard booking button
    document.getElementById('bookTicketBtn').addEventListener('click', () => {
      ViewManager.showBooking();
    });
    
    // Book new ticket from empty state
    document.getElementById('bookNewTicket').addEventListener('click', () => {
      ViewManager.showBooking();
    });
  };

  // Public API
  return {
    init
  };
})();