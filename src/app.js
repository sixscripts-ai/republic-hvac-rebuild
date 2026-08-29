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

  const composeMessage = (fields) => {
    const lines = [
      `Service request from ${fields.name || 'a visitor'} (via website questionnaire)`,
      '',
      `Concern: ${fields.concern || 'Not stated'}`,
      `Detail: ${fields.detail || 'Not specified'}`,
      `Description: ${fields.description || 'No additional notes'}`,
      '',
      `Name: ${fields.name || ''}`,
      `Phone: ${fields.phone || ''}`,
      `Email: ${fields.email || ''}`,
      `Service area / ZIP: ${fields.zip || 'Not provided'}`,
      '',
      `Submitted: ${new Date().toLocaleString()}`
    ];
    return lines.join('\n');
  };

  const quiz = document.querySelector('[data-quiz-form]');
  if (quiz) {
    const panels = Array.from(quiz.querySelectorAll('[data-quiz-step-panel]'));
    const stepRef = quiz.querySelector('[data-quiz-step]');
    const bar = quiz.querySelector('[data-quiz-bar]');
    const backBtn = quiz.querySelector('[data-quiz-back]');
    const nextBtn = quiz.querySelector('[data-quiz-next]');
    const submitBtn = quiz.querySelector('[data-quiz-submit]');
    const status = quiz.querySelector('[data-quiz-status]');

    const branchGroups = Array.from(quiz.querySelectorAll('[data-quiz-branch]'));
    const detailInputs = Array.from(quiz.querySelectorAll('input[name="detail"]'));
    const concernInputs = Array.from(quiz.querySelectorAll('input[name="concern"]'));
    const contactInputs = Array.from(quiz.querySelectorAll('[data-quiz-contact]'));
    const descInput = quiz.querySelector('[data-quiz-desc]');

    const s = {
      concern: quiz.querySelector('[data-quiz-s-concern]'),
      detail: quiz.querySelector('[data-quiz-s-detail]'),
      desc: quiz.querySelector('[data-quiz-s-desc]'),
      name: quiz.querySelector('[data-quiz-s-name]'),
      contact: quiz.querySelector('[data-quiz-s-contact]'),
      zip: quiz.querySelector('[data-quiz-s-zip]')
    };

    let current = 1;
    const total = 5;

    const branchFor = (concern = '') => {
      const key = concern.replace(/[^a-z]/gi, '').toLowerCase();
      if (key.includes('cool')) return 'cooling';
      if (key.includes('heat') || key.includes('furnace')) return 'heating';
      if (key.includes('mainten')) return 'maintenance';
      if (key.includes('commercial')) return 'commercial';
      return 'not-sure';
    };

    const showBranch = (group) => {
      branchGroups.forEach((el) => { el.hidden = el !== group; });
    };

    const selectedDetail = () => quiz.querySelector('input[name="detail"]:checked');

    const getField = (name) => {
      const el = quiz.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : '';
    };

    const renderSummary = () => {
      s.concern.textContent = getField('concern') || '—';
      s.detail.textContent = getField('detail') || '—';
      s.desc.textContent = getField('description') || 'No additional notes';
      const name = getField('name');
      s.name.textContent = name || '—';
      const contact = [getField('phone'), getField('email')].filter(Boolean).join(' · ');
      s.contact.textContent = contact || '—';
      s.zip.textContent = getField('zip') || '—';
    };

    const go = (step) => {
      current = step;
      panels.forEach((p) => {
        p.hidden = Number(p.getAttribute('data-step')) !== current;
      });
      stepRef.textContent = String(current);
      bar.style.setProperty('--p', `${(current / total) * 100}%`);
      backBtn.disabled = current === 1;
      const isReview = current === total;
      nextBtn.hidden = isReview;
      submitBtn.hidden = !isReview;
      if (status) { status.textContent = ''; status.removeAttribute('data-state'); }
      if (isReview) renderSummary();
      const focusTarget = panels.find((p) => Number(p.getAttribute('data-step')) === current);
      if (focusTarget) {
        const first = focusTarget.querySelector('input:not([type="hidden"]), textarea, button, select, a');
        (first || focusTarget.querySelector('legend') || focusTarget).focus();
      }
    };

    const stepValid = () => {
      if (current === 1) return concernInputs.some((i) => i.checked);
      if (current === 2) return Boolean(selectedDetail());
      if (current === 4) return quiz.reportValidity() !== false;
      return true;
    };

    const showError = (msg) => {
      if (status) { status.textContent = msg; status.setAttribute('data-state', 'error'); }
    };

    nextBtn.addEventListener('click', () => {
      if (!stepValid()) {
        showError('Please finish answering the current question before continuing.');
        return;
      }
      go(current + 1);
    });

    backBtn.addEventListener('click', () => {
      go(Math.max(1, current - 1));
    });

    concernInputs.forEach((input) => {
      input.addEventListener('change', () => {
        showBranch(branchGroups.find((g) => g.getAttribute('data-quiz-branch') === branchFor(input.value)));
      });
    });

    const contactSubmit = (fields) => {
      const endpoint = (quiz.getAttribute('action') || '').trim();
      if (!endpoint || endpoint === '#') {
        status.textContent = 'Preview mode: connect a real form endpoint before launch so this request reaches the business inbox.';
        status.setAttribute('data-state', 'notice');
        return;
      }
      submitBtn.disabled = true;
      status.textContent = 'Sending your request…';
      status.setAttribute('data-state', 'working');
      const body = new FormData();
      body.set('name', fields.name);
      body.set('phone', fields.phone);
      body.set('email', fields.email);
      body.set('zip', fields.zip);
      body.set('service', 'Website questionnaire');
      body.set('message', composeMessage(fields));
      fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body })
        .then((res) => { if (!res.ok) throw new Error('Request failed'); return res; })
        .then(() => {
          status.textContent = 'Your service summary was sent. The Republic HVAC team can follow up using the contact details you provided.';
          status.setAttribute('data-state', 'success');
          submitBtn.hidden = true;
          nextBtn.hidden = false;
          nextBtn.disabled = true;
          nextBtn.textContent = 'Done';
          nextBtn.addEventListener('click', () => { go(1); nextBtn.disabled = false; nextBtn.textContent = 'Next'; nextBtn.hidden = true; submitBtn.hidden = true; });
        })
        .catch(() => {
          status.textContent = 'Your request could not be sent. Please use the phone or email contact shown on this page.';
          status.setAttribute('data-state', 'error');
        })
        .finally(() => { submitBtn.disabled = false; });
    };

    quiz.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!quiz.reportValidity()) return;
      const fields = {
        name: getField('name'),
        phone: getField('phone'),
        email: getField('email'),
        zip: getField('zip'),
        concern: getField('concern'),
        detail: getField('detail'),
        description: getField('description')
      };
      contactSubmit(fields);
    });
  }

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
