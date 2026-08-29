(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.toggleAttribute('data-open', !open);
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector('[data-service-form]');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const endpoint = form.getAttribute('action') || '';
      if (!endpoint || endpoint === '#') {
        status.textContent = 'This form is in preview mode. Connect a real form endpoint before launch.';
        status.setAttribute('data-state', 'notice');
        return;
      }

      if (!form.reportValidity()) return;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.textContent = 'Sending your request…';
      status.setAttribute('data-state', 'working');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        status.textContent = 'Your request was sent. The Republic HVAC team can now follow up using the contact details you provided.';
        status.setAttribute('data-state', 'success');
      } catch (error) {
        status.textContent = 'Your request could not be sent. Please use the phone or email contact shown on this page.';
        status.setAttribute('data-state', 'error');
      } finally {
        button.disabled = false;
      }
    });
  }
})();
