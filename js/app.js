/**
 * Main Application
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize application modules
  Auth.init();
  BookingManager.init();
  UserDashboard.init();
  AdminManager.init();
  
  // Add CSS for toast notifications
  const style = document.createElement('style');
  style.textContent = `
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }
    
    .toast {
      background-color: #fff;
      color: #333;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 10px;
      max-width: 350px;
      font-size: 14px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .toast-success {
      border-left: 4px solid #4caf50;
    }
    
    .toast-error {
      border-left: 4px solid #f44336;
    }
    
    .toast-warning {
      border-left: 4px solid #ff9800;
    }
    
    .toast-info {
      border-left: 4px solid #2196f3;
    }
    
    /* Additional styling for ticket modal */
    .ticket-view {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    
    .ticket-header-view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .pnr-info {
      display: flex;
      flex-direction: column;
    }
    
    .pnr-label {
      font-size: 12px;
      color: #6b7280;
    }
    
    .pnr-number {
      font-size: 18px;
      font-weight: 600;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .journey-stations {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .station-card {
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 8px;
      width: 40%;
    }
    
    .station-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .station-time {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    
    .station-date {
      font-size: 14px;
      color: #6b7280;
    }
    
    .journey-line {
      flex: 1;
      display: flex;
      justify-content: center;
      position: relative;
    }
    
    .journey-line::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #e5e7eb;
      z-index: 0;
    }
    
    .journey-line svg {
      position: relative;
      background-color: white;
      border-radius: 50%;
      padding: 5px;
      color: #0056a1;
      z-index: 1;
    }
    
    .train-details {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    
    .train-name {
      font-size: 16px;
      font-weight: 600;
    }
    
    .train-class {
      font-size: 14px;
      color: #6b7280;
    }
    
    .passenger-section h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .passenger-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .passenger-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    
    .passenger-info {
      display: flex;
      flex-direction: column;
    }
    
    .passenger-name {
      font-weight: 600;
    }
    
    .passenger-details {
      font-size: 14px;
      color: #6b7280;
    }
    
    .seat-info {
      text-align: right;
    }
    
    .seat-info .coach {
      font-weight: 600;
    }
    
    .ticket-footer-view {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    
    .ticket-price-view {
      text-align: right;
    }
    
    .price-label {
      font-size: 14px;
      color: #6b7280;
    }
    
    .price-value {
      font-size: 18px;
      font-weight: 600;
      color: #0056a1;
    }
    
    /* Empty table state */
    .empty-table {
      text-align: center;
      padding: 30px;
      color: #6b7280;
    }
    
    /* Ticket view in ticket modal */
    @media (max-width: 768px) {
      .journey-stations {
        flex-direction: column;
        gap: 15px;
      }
      
      .station-card {
        width: 100%;
      }
      
      .journey-line {
        height: 40px;
        width: 100%;
      }
      
      .journey-line::before {
        top: 0;
        bottom: 0;
        width: 2px;
        height: auto;
        left: 50%;
        right: auto;
      }
      
      .passenger-item {
        flex-direction: column;
        gap: 10px;
      }
      
      .seat-info {
        text-align: left;
      }
      
      .ticket-footer-view {
        flex-direction: column;
        gap: 15px;
      }
      
      .ticket-price-view {
        text-align: left;
      }
    }
  `;
  
  document.head.appendChild(style);
});