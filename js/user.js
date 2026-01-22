/**
 * User Dashboard Module
 */
const UserDashboard = (() => {
  // DOM elements
  const upcomingTickets = document.getElementById('upcomingTickets');
  const completedTickets = document.getElementById('completedTickets');
  const cancelledTickets = document.getElementById('cancelledTickets');
  const noUpcomingTickets = document.getElementById('noUpcomingTickets');
  const noCompletedTickets = document.getElementById('noCompletedTickets');
  const noCancelledTickets = document.getElementById('noCancelledTickets');
  const ticketModal = document.getElementById('ticketModal');
  const ticketDetails = document.getElementById('ticketDetails');
  const printTicketBtn = document.getElementById('printTicket');
  const cancelTicketBtn = document.getElementById('cancelTicket');
  const closeTicketModalBtn = document.getElementById('closeTicketModal');

  // Current ticket being viewed
  let currentTicket = null;

  // Load user's tickets
  const loadTickets = () => {
    const user = DB.getCurrentUser();
    if (!user) return;

    const allBookings = DB.getAll(DB.KEYS.BOOKINGS);
    const userBookings = allBookings.filter(booking => booking.userId === user.id);
    
    // Current date for comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Filter bookings by status
    const upcoming = userBookings.filter(booking => {
      const bookingDate = new Date(booking.departureDate);
      return bookingDate >= currentDate && booking.status === 'confirmed';
    });
    
    const completed = userBookings.filter(booking => {
      const bookingDate = new Date(booking.departureDate);
      return bookingDate < currentDate && booking.status === 'confirmed';
    });
    
    const cancelled = userBookings.filter(booking => booking.status === 'cancelled');
    
    // Display bookings in respective tabs
    displayTickets(upcoming, upcomingTickets, noUpcomingTickets);
    displayTickets(completed, completedTickets, noCompletedTickets);
    displayTickets(cancelled, cancelledTickets, noCancelledTickets);
  };

  // Display tickets in a container
  const displayTickets = (tickets, container, emptyStateEl) => {
    container.innerHTML = '';
    
    if (tickets.length === 0) {
      emptyStateEl.classList.remove('hidden');
      return;
    }
    
    emptyStateEl.classList.add('hidden');
    
    tickets.forEach(ticket => {
      const ticketCard = document.createElement('div');
      ticketCard.className = 'ticket-card';
      ticketCard.dataset.ticketId = ticket.id;
      
      const statusClass = getStatusClass(ticket.status);
      
      ticketCard.innerHTML = `
        <div class="ticket-status ${statusClass}">${ticket.status}</div>
        <div class="ticket-header">
          <div class="journey-info">
            <div class="station-names">
              <span>${ticket.from}</span>
              <span class="station-divider">→</span>
              <span>${ticket.to}</span>
            </div>
            <div class="journey-date">${formatDate(ticket.departureDate)}</div>
          </div>
          <div class="train-info">
            <div class="train-name-number">
              ${ticket.trainName} (${ticket.trainNumber})
            </div>
          </div>
        </div>
        
        <div class="ticket-body">
          <div class="ticket-details">
            <div class="detail-item">
              <div class="detail-label">PNR</div>
              <div class="detail-value">${ticket.pnr}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Class</div>
              <div class="detail-value">${ticket.class}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Departure</div>
              <div class="detail-value">${ticket.departureTime}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Passengers</div>
              <div class="detail-value">${ticket.passengers.length}</div>
            </div>
          </div>
          
          <div class="ticket-footer">
            <div class="ticket-price">₹${ticket.fare}</div>
            <div class="ticket-actions">
              <button class="ticket-action-btn view-ticket" title="View Ticket">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="ticket-action-btn print-ticket" title="Print Ticket">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              </button>
              ${ticket.status === 'confirmed' ? `
                <button class="ticket-action-btn cancel-ticket" title="Cancel Ticket">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners for actions
      ticketCard.querySelector('.view-ticket').addEventListener('click', () => {
        viewTicket(ticket);
      });
      
      ticketCard.querySelector('.print-ticket').addEventListener('click', () => {
        printTicket(ticket);
      });
      
      const cancelBtn = ticketCard.querySelector('.cancel-ticket');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          cancelTicket(ticket);
        });
      }
      
      container.appendChild(ticketCard);
    });
  };

  // View ticket details
  const viewTicket = (ticket) => {
    currentTicket = ticket;
    
    // Format passenger list
    const passengersHtml = ticket.passengers.map((passenger, index) => `
      <div class="passenger-item">
        <div class="passenger-info">
          <div class="passenger-name">${passenger.name}</div>
          <div class="passenger-details">
            ${passenger.age} Years, ${passenger.gender}
          </div>
        </div>
        <div class="seat-info">
          <div class="coach">Coach: ${passenger.coach}</div>
          <div class="seat">Seat: ${passenger.seatNumber}</div>
        </div>
      </div>
    `).join('');
    
    ticketDetails.innerHTML = `
      <div class="ticket-view">
        <div class="ticket-header-view">
          <div class="pnr-info">
            <div class="pnr-label">PNR</div>
            <div class="pnr-number">${ticket.pnr}</div>
          </div>
          <div class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</div>
        </div>
        
        <div class="ticket-journey">
          <div class="journey-stations">
            <div class="station-card">
              <div class="station-name">${ticket.from}</div>
              <div class="station-time">${ticket.departureTime}</div>
              <div class="station-date">${formatDate(ticket.departureDate)}</div>
            </div>
            
            <div class="journey-line">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            
            <div class="station-card">
              <div class="station-name">${ticket.to}</div>
              <div class="station-time">${ticket.arrivalTime}</div>
              <div class="station-date">${formatDate(ticket.departureDate)}</div>
            </div>
          </div>
          
          <div class="train-details">
            <div class="train-name">${ticket.trainName} (${ticket.trainNumber})</div>
            <div class="train-class">${ticket.classname}</div>
          </div>
        </div>
        
        <div class="passenger-section">
          <h3>Passenger Details</h3>
          <div class="passenger-list">
            ${passengersHtml}
          </div>
        </div>
        
        <div class="ticket-footer-view">
          <div class="ticket-info">
            <div class="info-item">
              <div class="info-label">Booking Date</div>
              <div class="info-value">${formatDate(ticket.bookingDate)}</div>
            </div>
          </div>
          <div class="ticket-price-view">
            <div class="price-label">Total Fare</div>
            <div class="price-value">₹${ticket.fare}</div>
          </div>
        </div>
      </div>
    `;
    
    // Show/Hide cancel button based on ticket status
    cancelTicketBtn.style.display = ticket.status === 'confirmed' ? 'block' : 'none';
    
    // Show the modal
    ViewManager.showModal('ticketModal');
  };

  // Print ticket
  const printTicket = (ticket) => {
    // Prepare ticket for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      ViewManager.showToast('Please allow popups to print the ticket', 'error');
      return;
    }
    
    const passengersHtml = ticket.passengers.map((passenger, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${passenger.name}</td>
        <td>${passenger.age}</td>
        <td>${passenger.gender}</td>
        <td>${passenger.coach}</td>
        <td>${passenger.seatNumber}</td>
      </tr>
    `).join('');
    
    printWindow.document.write(`
      <html>
      <head>
        <title>E-Ticket - PNR: ${ticket.pnr}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .ticket-container { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0056a1; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #0056a1; }
          .pnr { font-size: 16px; }
          .pnr-value { font-weight: bold; }
          .journey { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .station { text-align: center; }
          .station-name { font-weight: bold; font-size: 18px; }
          .station-time { font-size: 16px; }
          .train-info { margin-bottom: 20px; border: 1px dashed #ccc; padding: 10px; background: #f9f9f9; }
          .train-name { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .price { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="header">
            <div class="logo">Indian Railways</div>
            <div class="pnr">PNR: <span class="pnr-value">${ticket.pnr}</span></div>
          </div>
          
          <div class="journey">
            <div class="station">
              <div class="station-name">${ticket.from}</div>
              <div class="station-time">${ticket.departureTime}</div>
              <div class="station-date">${formatDate(ticket.departureDate)}</div>
            </div>
            
            <div style="align-self: center; font-size: 20px;">→</div>
            
            <div class="station">
              <div class="station-name">${ticket.to}</div>
              <div class="station-time">${ticket.arrivalTime}</div>
              <div class="station-date">${formatDate(ticket.departureDate)}</div>
            </div>
          </div>
          
          <div class="train-info">
            <div class="train-name">${ticket.trainName} (${ticket.trainNumber})</div>
            <div>Class: ${ticket.classname}</div>
            <div>Status: ${ticket.status.toUpperCase()}</div>
          </div>
          
          <h3>Passenger Details</h3>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Coach</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>
              ${passengersHtml}
            </tbody>
          </table>
          
          <div class="price">Total Fare: ₹${ticket.fare}</div>
          
          <div class="footer">
            <p>Thank you for choosing Indian Railways. Happy Journey!</p>
            <p>This is a computer-generated ticket and does not require a signature.</p>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Print Ticket</button>
          <button onclick="window.close()">Close</button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Cancel ticket
  const cancelTicket = (ticket) => {
    if (confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
      ViewManager.showLoading();
      
      setTimeout(() => {
        // Update ticket status to cancelled
        const allBookings = DB.getAll(DB.KEYS.BOOKINGS);
        const bookingIndex = allBookings.findIndex(b => b.id === ticket.id);
        
        if (bookingIndex !== -1) {
          allBookings[bookingIndex].status = 'cancelled';
          DB.save(DB.KEYS.BOOKINGS, allBookings);
          
          // Restore train availability
          const trains = DB.getAll(DB.KEYS.TRAINS);
          const trainIndex = trains.findIndex(t => t.id === ticket.trainId);
          
          if (trainIndex !== -1) {
            const classIndex = trains[trainIndex].classes.findIndex(c => c.code === ticket.class);
            
            if (classIndex !== -1) {
              trains[trainIndex].classes[classIndex].available += ticket.passengers.length;
              DB.save(DB.KEYS.TRAINS, trains);
            }
          }
          
          ViewManager.hideLoading();
          ViewManager.hideModal('ticketModal');
          ViewManager.showToast('Ticket cancelled successfully', 'success');
          
          // Reload tickets
          loadTickets();
        }
      }, 800);
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'waiting': return 'status-waiting';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
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

  // Initialize user dashboard
  const init = () => {
    // Initialize tabs
    ViewManager.initializeTabs(document.querySelector('.dashboard-tabs'), 'upcoming');
    
    // Modal buttons
    printTicketBtn.addEventListener('click', () => {
      if (currentTicket) {
        printTicket(currentTicket);
      }
    });
    
    cancelTicketBtn.addEventListener('click', () => {
      if (currentTicket) {
        cancelTicket(currentTicket);
      }
    });
    
    closeTicketModalBtn.addEventListener('click', () => {
      ViewManager.hideModal('ticketModal');
    });
  };

  // Public API
  return {
    init,
    loadTickets
  };
})();