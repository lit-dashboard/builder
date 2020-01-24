import { isEditModeOn } from '@lit-dashboard/lit-dashboard/storage';
import { remote } from 'electron';
import { triggerEvent } from './events';

const { Menu, MenuItem, app } = remote;

let menu = Menu.getApplicationMenu();

const newMenu = new Menu();

let fileMenuItem = new MenuItem({ 
  label: 'File', 
  submenu: [
    { 
      label: 'Save', 
      accelerator: 'CommandOrControl+S',
      click() { 
        triggerEvent('fileMenuSave');
      } 
    },
    { 
      label: 'Open', 
      accelerator: 'CommandOrControl+O',
      click() { 
        triggerEvent('fileMenuOpen');
      } 
    },
    { type: 'separator' },
    {
      label: 'Close',
      click() {
          app.quit();
      }
    }
  ] 
});

let dashboardMenuItem = new MenuItem({ 
  label: 'Dashboard',
  submenu: [
    { 
      label: 'Edit Mode',
      type: 'checkbox',
      checked: isEditModeOn(),
      accelerator: 'CommandOrControl+E',
      click(event) {
        triggerEvent('fileMenuEditMode', event.checked);
      } 
    },
    { 
      label: 'Source Settings',
      click() { 
        triggerEvent('fileMenuSourceProviderSettings');
      } 
    },
  ] 
});



newMenu.append(menu.items[0]);
newMenu.append(fileMenuItem);
newMenu.append(dashboardMenuItem);

if (menu.items.length === 6) {
  newMenu.append(menu.items[2]);
  newMenu.append(menu.items[3]);
  newMenu.append(menu.items[4]);
  newMenu.append(menu.items[5]);
} else {
  newMenu.append(menu.items[3]);
  newMenu.append(menu.items[4]);
  newMenu.append(menu.items[5]);
  newMenu.append(menu.items[6]);
}


Menu.setApplicationMenu(newMenu); 

