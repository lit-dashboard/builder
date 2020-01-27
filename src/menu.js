import { isEditModeOn } from '@lit-dashboard/lit-dashboard/storage';
import { remote, shell } from 'electron';
import { triggerEvent } from './events';

const { Menu, MenuItem, app } = remote;
const isMac = process.platform === 'darwin';

const newMenu = new Menu();

const appMenuItem = new MenuItem({
  label: 'lit-dashboard',
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' }
  ]
});

const fileMenuItem = new MenuItem({ 
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

const dashboardMenuItem = new MenuItem({ 
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

const editMenuItem = new MenuItem({
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    ...(isMac ? [
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    ] : [
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' }
    ])
  ]
});

const viewMenuItem = new MenuItem( {
  label: 'View',
  submenu: [
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]
});

const windowMenuItem = new MenuItem({
  label: 'Window',
  submenu: [
    { role: 'minimize' },
    { role: 'zoom' },
    ...(isMac ? [
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' }
    ] : [
      { role: 'close' }
    ])
  ]
});

const helpMenuItem = new MenuItem({
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click: async () => {
        await shell.openExternal('https://electronjs.org')
      }
    }
  ]
});

if (isMac) {
  newMenu.append(appMenuItem);
}

newMenu.append(fileMenuItem);
newMenu.append(dashboardMenuItem);
newMenu.append(editMenuItem);
newMenu.append(viewMenuItem);
newMenu.append(windowMenuItem);
newMenu.append(helpMenuItem);

Menu.setApplicationMenu(newMenu); 

