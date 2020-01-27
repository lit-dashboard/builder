

export const notifyError = (msg, widgetNode = null) => {
  const notify = window.document.createElement('vaadin-notification');
  
  notify.renderer = function(root) {
    const text = window.document.createTextNode(msg);
    root.appendChild(text);

    const dismissBtn = window.document.createElement('vaadin-button');
    dismissBtn.textContent = 'Dismiss';
    dismissBtn.addEventListener('click', function() {
      notify.close();
    });
    root.appendChild(dismissBtn);

    if (widgetNode) {
      const showWidgetBtn = window.document.createElement('vaadin-button');
      showWidgetBtn.textContent = 'Reveal';
      showWidgetBtn.setAttribute('theme', 'primary');
      showWidgetBtn.addEventListener('click', function() {
        widgetNode.openDevTools();
      });
      root.appendChild(showWidgetBtn);
    }

  };

  window.document.body.appendChild(notify);

  notify.position = 'top-end';
  notify.duration = 6000;
  notify.opened = true;
  notify.setAttribute('theme', 'error');

  notify.addEventListener('opened-changed', function() {
    window.document.body.removeChild(notify);
  });
}


export const notifySuccess = (msg, widgetNode = null) => {
  const notify = window.document.createElement('vaadin-notification');
  
  notify.renderer = function(root) {
    const text = window.document.createTextNode(msg);
    root.appendChild(text);

    const dismissBtn = window.document.createElement('vaadin-button');
    dismissBtn.textContent = 'Dismiss';
    dismissBtn.addEventListener('click', function() {
      notify.close();
    });
    root.appendChild(dismissBtn);
  };

  window.document.body.appendChild(notify);

  notify.position = 'top-end';
  notify.duration = 6000;
  notify.opened = true;
  notify.setAttribute('theme', 'success');

  notify.addEventListener('opened-changed', function() {
    window.document.body.removeChild(notify);
  });
}