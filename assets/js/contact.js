/* ==========================================================================
   SPEARPOINT ADVISORS — Contact Page Script
   ==========================================================================
   Submits the contact form via AJAX to admin-ajax.php (see functions.php ->
   spearpoint_handle_contact_submit), which sends the message with
   wp_mail(). No page reload, inline success/error messaging.

   When opened as a plain static file (e.g. VS Code Live Server, no
   WordPress backend), `spearpointContact` won't exist — in that case this
   falls back to a local-only mock submit so the interaction/animation can
   still be previewed. No email is sent in that mode.
   ========================================================================== */
(function initContactForm() {
  'use strict';

  const form = document.getElementById('spearpoint-contact-form');
  if (!form) return;

  const isLive = typeof spearpointContact !== 'undefined';
  if (!isLive) {
    console.info('[contact.js] Local preview mode — no WordPress backend detected, form submissions are mocked.');
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector('.contact-form__submit-label');
  const statusEl = form.querySelector('.contact-form__status');
  const defaultLabel = submitLabel ? submitLabel.textContent : 'Send Message';

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove('contact-form__status--success', 'contact-form__status--error');
    statusEl.classList.add(type === 'success' ? 'contact-form__status--success' : 'contact-form__status--error');
    requestAnimationFrame(() => statusEl.classList.add('is-visible'));
  }

  function clearStatus() {
    statusEl.classList.remove('is-visible', 'contact-form__status--success', 'contact-form__status--error');
    statusEl.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending…';

    const finish = () => {
      submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = defaultLabel;
    };

    if (!isLive) {
      // Local preview mock — simulates the real request's timing/outcome
      // without a backend, purely so the animation can be previewed.
      const name = (form.querySelector('#contact-name') || {}).value || 'there';
      window.setTimeout(() => {
        setStatus(`Thanks, ${name} — your message is on its way. We'll be in touch soon. (Preview mode — no email was actually sent.)`, 'success');
        form.reset();
        finish();
      }, 900);
      return;
    }

    const data = new FormData(form);
    data.append('action', 'spearpoint_contact_submit');
    data.append('nonce', spearpointContact.nonce);

    fetch(spearpointContact.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: data
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStatus(json.data.message, 'success');
          form.reset();
        } else {
          setStatus((json.data && json.data.message) || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(() => {
        setStatus('Something went wrong. Please check your connection and try again.', 'error');
      })
      .finally(finish);
  });
})();
