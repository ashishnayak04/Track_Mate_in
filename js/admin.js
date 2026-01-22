/**
 * Admin Dashboard Module
 */
const AdminManager = (() => {
  // DOM elements
  const bookingTableBody = document.getElementById('bookingTableBody');
  const usersTableBody = document.getElementById('usersTableBody');
  const trainsTableBody = document.getElementById('trainsTableBody');
  const searchBookingInput = document.getElementById('searchBooking');
  const searchUserInput = document.getElementById('searchUser');
  const selectAllBookingsCheckbox = document.getElementById('selectAllBookings');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
  const addTrainBtn = document.getElementById('addTrainBtn');

  // Load and display all bookings
  const loadBookings = () => {
    const bookings = DB.getAll(DB.KEYS.BOOKINGS);
    displayBookings(bookings);
  };

  // Display bookings in the table
  const displayBookings = (bookings) => {
    bookingTableBody.innerHTML = '';
    
    if (bookings.length === 0) {
      bookingTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-table">No bookings found</td>
        </tr>
      `;
      return;
    }
    
    bookings.forEach(booking => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="booking-checkbox" data-id="${booking.id}"></td>
        <td>${booking.pnr}</td>
        <td>${booking.passengers[0].name}${booking.passengers.length > 1 ? ` + ${booking.passengers.length - 1}` : ''}</td>
        <td>${booking.from}</td>
        <td>${booking.to}</td>
        <td>${formatDate(booking.departureDate)}</td>
        <td>${booking.trainName}</td>
        <td><span class="badge badge-${getStatusBadgeClass(booking.status)}">${booking.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn action-view" title="View Details">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="table-action-btn action-edit" title="Edit Booking">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="table-action-btn action-delete" title="Delete Booking">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      
      // Add event listeners for actions
      row.querySelector('.action-view').addEventListener('click', () => {
        viewBooking(booking);
      });
      
      row.querySelector('.action-edit').addEventListener('click', () => {
        editBooking(booking);
      });
      
      row.querySelector('.action-delete').addEventListener('click', () => {
        deleteBooking(booking.id);
      });
      
      bookingTableBody.appendChild(row);
    });
  };

  // Load and display all users
  const loadUsers = () => {
    const users = DB.getAll(DB.KEYS.USERS);
    displayUsers(users);
  };

  // Display users in the table
  const displayUsers = (users) => {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table">No users found</td>
        </tr>
      `;
      return;
    }
    
    users.forEach(user => {
      const bookings = DB.getAll(DB.KEYS.BOOKINGS).filter(b => b.userId === user.id);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id.substring(0, 8)}...</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td>${bookings.length}</td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn action-view" title="View User">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="table-action-btn action-edit" title="Edit User">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="table-action-btn action-delete" title="Delete User">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      
      // Add event listeners for actions
      row.querySelector('.action-view').addEventListener('click', () => {
        viewUser(user);
      });
      
      row.querySelector('.action-edit').addEventListener('click', () => {
        editUser(user);
      });
      
      row.querySelector('.action-delete').addEventListener('click', () => {
        deleteUser(user.id);
      });
      
      usersTableBody.appendChild(row);
    });
  };

  // Load and display all trains
  const loadTrains = () => {
    const trains = DB.getAll(DB.KEYS.TRAINS);
    displayTrains(trains);
  };

  // Display trains in the table
  const displayTrains = (trains) => {
    trainsTableBody.innerHTML = '';
    
    if (trains.length === 0) {
      trainsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-table">No trains found</td>
        </tr>
      `;
      return;
    }
    
    trains.forEach(train => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${train.number}</td>
        <td>${train.name}</td>
        <td>${train.from}</td>
        <td>${train.to}</td>
        <td>${train.departureTime}</td>
        <td>${train.arrivalTime}</td>
        <td>${train.distance}</td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn action-view" title="View Train">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="table-action-btn action-edit" title="Edit Train">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="table-action-btn action-delete" title="Delete Train">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      
      // Add event listeners for actions
      row.querySelector('.action-view').addEventListener('click', () => {
        viewTrain(train);
      });
      
      row.querySelector('.action-edit').addEventListener('click', () => {
        editTrain(train);
      });
      
      row.querySelector('.action-delete').addEventListener('click', () => {
        deleteTrain(train.id);
      });
      
      trainsTableBody.appendChild(row);
    });
  };

  // View booking details
  const viewBooking = (booking) => {
    // TODO: Implement booking details modal
    alert(`View booking: ${booking.pnr}`);
  };

  // Edit booking
  const editBooking = (booking) => {
    // TODO: Implement booking edit modal
    alert(`Edit booking: ${booking.pnr}`);
  };

  // Delete booking
  const deleteBooking = (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      ViewManager.showLoading();
      
      setTimeout(() => {
        DB.remove(DB.KEYS.BOOKINGS, id);
        ViewManager.hideLoading();
        ViewManager.showToast('Booking deleted successfully', 'success');
        loadBookings();
      }, 500);
    }
  };

  // View user details
  const viewUser = (user) => {
    // TODO: Implement user details modal
    alert(`View user: ${user.username}`);
  };

  // Edit user
  const editUser = (user) => {
    // TODO: Implement user edit modal
    alert(`Edit user: ${user.username}`);
  };

  // Delete user
  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      ViewManager.showLoading();
      
      setTimeout(() => {
        // Delete user
        DB.remove(DB.KEYS.USERS, id);
        
        // Delete associated bookings
        const bookings = DB.getAll(DB.KEYS.BOOKINGS);
        const userBookings = bookings.filter(b => b.userId === id);
        
        userBookings.forEach(booking => {
          DB.remove(DB.KEYS.BOOKINGS, booking.id);
        });
        
        ViewManager.hideLoading();
        ViewManager.showToast('User deleted successfully', 'success');
        loadUsers();
        loadBookings();
      }, 500);
    }
  };

  // View train details
  const viewTrain = (train) => {
    // TODO: Implement train details modal
    alert(`View train: ${train.name}`);
  };

  // Edit train
  const editTrain = (train) => {
    // TODO: Implement train edit modal
    alert(`Edit train: ${train.name}`);
  };

  // Delete train
  const deleteTrain = (id) => {
    if (confirm('Are you sure you want to delete this train?')) {
      ViewManager.showLoading();
      
      setTimeout(() => {
        DB.remove(DB.KEYS.TRAINS, id);
        ViewManager.hideLoading();
        ViewManager.showToast('Train deleted successfully', 'success');
        loadTrains();
      }, 500);
    }
  };

  // Delete selected bookings
  const deleteSelectedBookings = () => {
    const checkboxes = document.querySelectorAll('.booking-checkbox:checked');
    
    if (checkboxes.length === 0) {
      ViewManager.showToast('No bookings selected', 'error');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${checkboxes.length} bookings?`)) {
      ViewManager.showLoading();
      
      setTimeout(() => {
        checkboxes.forEach(checkbox => {
          const id = checkbox.getAttribute('data-id');
          DB.remove(DB.KEYS.BOOKINGS, id);
        });
        
        ViewManager.hideLoading();
        ViewManager.showToast(`${checkboxes.length} bookings deleted successfully`, 'success');
        loadBookings();
      }, 800);
    }
  };

  // Toggle all bookings selection
  const toggleAllBookings = (checked) => {
    const checkboxes = document.querySelectorAll('.booking-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
    });
  };

  // Search bookings
  const searchBookings = (term) => {
    if (!term) {
      loadBookings();
      return;
    }
    
    const bookings = DB.search(DB.KEYS.BOOKINGS, term, ['pnr', 'from', 'to', 'trainName']);
    displayBookings(bookings);
  };

  // Search users
  const searchUsers = (term) => {
    if (!term) {
      loadUsers();
      return;
    }
    
    const users = DB.search(DB.KEYS.USERS, term, ['name', 'username', 'email']);
    displayUsers(users);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'waiting': return 'warning';
      case 'cancelled': return 'danger';
      default: return '';
    }
  };

  // Initialize admin dashboard
  const init = () => {
    // Check if user is admin
    if (!DB.isAdmin()) {
      ViewManager.showLogin();
      return;
    }
    
    // Initialize tabs
    ViewManager.initializeTabs(document.querySelector('.admin-tabs'), 'bookings');
    
    // Load data
    loadBookings();
    loadUsers();
    loadTrains();
    
    // Event listeners for search
    searchBookingInput.addEventListener('input', (e) => {
      searchBookings(e.target.value);
    });
    
    searchUserInput.addEventListener('input', (e) => {
      searchUsers(e.target.value);
    });
    
    // Event listener for select all bookings
    selectAllBookingsCheckbox.addEventListener('change', (e) => {
      toggleAllBookings(e.target.checked);
    });
    
    // Event listener for delete selected bookings
    deleteSelectedBtn.addEventListener('click', deleteSelectedBookings);
    
    // Event listener for add train button
    addTrainBtn.addEventListener('click', () => {
      // TODO: Implement add train modal
      alert('Add new train');
    });
  };

  // Public API
  return {
    init
  };
})();