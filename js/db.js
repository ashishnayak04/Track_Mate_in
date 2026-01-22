/**
 * Database utility for local storage
 */
const DB = (() => {
  // Storage keys
  const KEYS = {
    USERS: 'railway_users',
    TRAINS: 'railway_trains',
    BOOKINGS: 'railway_bookings',
    CURRENT_USER: 'railway_current_user'
  };

  // Initialize with sample data if not exists
  const initializeDB = () => {
    // Sample users
    if (!localStorage.getItem(KEYS.USERS)) {
      const sampleUsers = [
        {
          id: 'admin123',
          username: 'root',
          password: 'abc123', // In a real app, this would be hashed
          name: 'Admin User',
          email: 'admin@railways.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(KEYS.USERS, JSON.stringify(sampleUsers));
    }

    // Sample trains
    if (!localStorage.getItem(KEYS.TRAINS)) {
      const sampleTrains = [
        {
          id: 'train1',
          number: '12301',
          name: 'Rajdhani Express',
          from: 'New Delhi',
          to: 'Mumbai Central',
          departureTime: '16:55',
          arrivalTime: '08:15',
          duration: '15h 20m',
          distance: '1384 KM',
          classes: [
            { code: '1A', name: 'AC First Class', available: 12, price: 3500 },
            { code: '2A', name: 'AC 2 Tier', available: 46, price: 2100 },
            { code: '3A', name: 'AC 3 Tier', available: 64, price: 1500 }
          ],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          id: 'train2',
          number: '12259',
          name: 'Shatabdi Express',
          from: 'New Delhi',
          to: 'Lucknow',
          departureTime: '06:10',
          arrivalTime: '12:40',
          duration: '6h 30m',
          distance: '513 KM',
          classes: [
            { code: 'EC', name: 'Executive Chair Car', available: 56, price: 1800 },
            { code: 'CC', name: 'AC Chair Car', available: 78, price: 1000 }
          ],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        {
          id: 'train3',
          number: '12951',
          name: 'Mumbai Rajdhani',
          from: 'Mumbai Central',
          to: 'New Delhi',
          departureTime: '17:00',
          arrivalTime: '08:35',
          duration: '15h 35m',
          distance: '1384 KM',
          classes: [
            { code: '1A', name: 'AC First Class', available: 10, price: 3600 },
            { code: '2A', name: 'AC 2 Tier', available: 48, price: 2150 },
            { code: '3A', name: 'AC 3 Tier', available: 72, price: 1550 }
          ],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          id: 'train4',
          number: '12002',
          name: 'Bhopal Shatabdi',
          from: 'New Delhi',
          to: 'Bhopal',
          departureTime: '06:15',
          arrivalTime: '13:10',
          duration: '6h 55m',
          distance: '707 KM',
          classes: [
            { code: 'EC', name: 'Executive Chair Car', available: 52, price: 1700 },
            { code: 'CC', name: 'AC Chair Car', available: 82, price: 950 }
          ],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          id: 'train5',
          number: '12280',
          name: 'Taj Express',
          from: 'New Delhi',
          to: 'Agra Cantt',
          departureTime: '07:10',
          arrivalTime: '10:05',
          duration: '2h 55m',
          distance: '195 KM',
          classes: [
            { code: 'CC', name: 'AC Chair Car', available: 75, price: 750 },
            { code: '2S', name: 'Second Sitting', available: 120, price: 250 }
          ],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ];
      localStorage.setItem(KEYS.TRAINS, JSON.stringify(sampleTrains));
    }

    // Sample bookings
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    }
  };

  // Get all data
  const getAll = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  // Get single item by ID
  const getById = (key, id) => {
    const allItems = getAll(key);
    return allItems.find(item => item.id === id);
  };

  // Save data
  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Add a new item
  const add = (key, item) => {
    const allItems = getAll(key);
    allItems.push(item);
    save(key, allItems);
    return item;
  };

  // Update an item
  const update = (key, id, updates) => {
    const allItems = getAll(key);
    const index = allItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      allItems[index] = { ...allItems[index], ...updates };
      save(key, allItems);
      return allItems[index];
    }
    
    return null;
  };

  // Delete an item
  const remove = (key, id) => {
    const allItems = getAll(key);
    const filtered = allItems.filter(item => item.id !== id);
    save(key, filtered);
    return filtered;
  };

  // Set current user
  const setCurrentUser = (user) => {
    if (user) {
      // Remove password for security before storing
      const { password, ...safeUser } = user;
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  };

  // Get current user
  const getCurrentUser = () => {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  };

  // Check if a user is admin
  const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
  };

  // Search functionality
  const search = (key, searchTerm, fields) => {
    const allItems = getAll(key);
    if (!searchTerm) return allItems;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return allItems.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(lowerSearchTerm);
      });
    });
  };

  // Filter functionality
  const filter = (key, filterFn) => {
    const allItems = getAll(key);
    return allItems.filter(filterFn);
  };

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Generate PNR number
  const generatePNR = () => {
    const pnrPrefix = '25';
    const randomDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return pnrPrefix + randomDigits;
  };

  // Initialize on load
  initializeDB();

  // Public API
  return {
    KEYS,
    getAll,
    getById,
    add,
    update,
    remove,
    setCurrentUser,
    getCurrentUser,
    isAdmin,
    search,
    filter,
    generateId,
    generatePNR
  };
})();