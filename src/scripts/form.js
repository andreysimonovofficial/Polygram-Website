document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('investor-form');
  if (!form) return;
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const amountInput = form.elements.amount;
  const submit = form.querySelector('button[type="submit"]');
  const success = document.getElementById('invest-success');

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  };
  const hideError = (id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  };

  const validate = () => {
    let ok = true;
    if (!nameInput.value.trim()) { showError('error-name', 'Введите имя и фамилию.'); ok = false; } else hideError('error-name');
    if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) { showError('error-email', 'Введите корректный рабочий email.'); ok = false; } else hideError('error-email');
    const amt = parseInt(amountInput.value, 10);
    if (!amountInput.value.trim() || isNaN(amt) || amt < 10000) { showError('error-amount', 'Укажите сумму от $10 000.'); ok = false; } else hideError('error-amount');
    submit.disabled = !ok;
    return ok;
  };

  [nameInput, emailInput, amountInput].forEach((input) => {
    input.addEventListener('input', validate);
    input.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = 'Отправка...';
    try {
      const res = await fetch('/api/investor-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          investmentAmount: parseInt(amountInput.value, 10),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      submit.disabled = false;
      submit.textContent = 'Отправить заявку';
      alert(err.message || 'Не удалось отправить заявку. Попробуйте позже.');
    }
  });
  validate();
});
