import dashboard from './dashboard';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = (role) => ({
  items: [dashboard(role)]
});

export default menuItems;