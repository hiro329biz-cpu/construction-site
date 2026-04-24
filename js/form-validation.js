/* ============================================================
   form-validation.js — Multi-step form with inline validation
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('estimateForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-page'));
  const stepIndicators = Array.from(document.querySelectorAll('.form-step__item'));
  const progressBar = document.getElementById('formProgress');
  let currentStep = 0;

  /* ── Show step ── */
  function showStep(index) {
    steps.forEach((s, i) => {
      s.style.display = i === index ? '' : 'none';
    });
    stepIndicators.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < index) s.classList.add('done');
      if (i === index) s.classList.add('active');
    });
    if (progressBar) {
      progressBar.style.width = ((index + 1) / steps.length * 100) + '%';
    }
    currentStep = index;
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }

  /* ── Validation rules ── */
  const rules = {
    required: v => v.trim() !== '' || '必須項目です',
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'メールアドレスの形式が正しくありません',
    tel:      v => v === '' || /^[0-9\-+() ]{10,15}$/.test(v) || '電話番号の形式が正しくありません（例: 090-1234-5678）',
    minlen:   (v, n) => v.trim().length >= n || `${n}文字以上入力してください`,
  };

  function validateField(field) {
    const val = field.value;
    const errEl = field.parentElement.querySelector('.form-error') ||
                  field.closest('.form-group')?.querySelector('.form-error');
    let error = null;

    if (field.required && rules.required(val) !== true) {
      error = rules.required(val);
    } else if (field.type === 'email' && val) {
      const r = rules.email(val);
      if (r !== true) error = r;
    } else if (field.dataset.tel !== undefined && val) {
      const r = rules.tel(val);
      if (r !== true) error = r;
    } else if (field.dataset.minlen && val) {
      const r = rules.minlen(val, parseInt(field.dataset.minlen));
      if (r !== true) error = r;
    }

    field.classList.toggle('error', !!error);
    if (errEl) {
      errEl.textContent = error || '';
      errEl.classList.toggle('show', !!error);
    }
    return !error;
  }

  /* ── Validate all fields in current step ── */
  function validateStep(stepIndex) {
    const stepEl = steps[stepIndex];
    const fields = Array.from(stepEl.querySelectorAll('input[required], select[required], textarea[required]'));
    // Also validate radio groups
    const radioGroups = {};
    stepEl.querySelectorAll('input[type="radio"][required]').forEach(r => {
      radioGroups[r.name] = radioGroups[r.name] || [];
      radioGroups[r.name].push(r);
    });

    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });

    // Validate radio groups
    Object.keys(radioGroups).forEach(name => {
      const group = radioGroups[name];
      const checked = group.some(r => r.checked);
      const errEl = group[group.length - 1].closest('.form-group')?.querySelector('.form-error');
      if (!checked) {
        valid = false;
        if (errEl) {
          errEl.textContent = '選択してください';
          errEl.classList.add('show');
        }
      } else if (errEl) {
        errEl.classList.remove('show');
      }
    });

    return valid;
  }

  /* ── Next button ── */
  form.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  /* ── Prev button ── */
  form.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  /* ── Confirm page: populate summary ── */
  form.querySelectorAll('.btn-confirm').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      populateSummary();
      showStep(currentStep + 1);
    });
  });

  function populateSummary() {
    const summaryEl = document.getElementById('formSummary');
    if (!summaryEl) return;
    const data = new FormData(form);
    const labels = {
      serviceType: '施工種別',
      buildingType: '建物種別',
      buildingAge: '築年数',
      area: '面積',
      timing: '希望時期',
      budget: '予算目安',
      name: 'お名前',
      tel: '電話番号',
      email: 'メールアドレス',
      address: 'ご住所',
      message: 'ご要望・備考',
    };
    let html = '';
    for (const [key, label] of Object.entries(labels)) {
      const val = data.get(key);
      if (val) {
        html += `<tr>
          <th style="text-align:left;padding:10px 16px;font-size:.85rem;color:var(--text-sub);font-weight:700;white-space:nowrap;border-bottom:1px solid var(--border);background:var(--beige);">${label}</th>
          <td style="padding:10px 16px;font-size:.9rem;border-bottom:1px solid var(--border);">${escHtml(val)}</td>
        </tr>`;
      }
    }
    summaryEl.innerHTML = html ? `<table style="width:100%;border-collapse:collapse;border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border);">${html}</table>` : '';
  }

  /* ── Submit ── */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
    }
    // Simulate async
    await new Promise(r => setTimeout(r, 1200));
    // Show success
    form.style.display = 'none';
    const success = document.getElementById('formSuccess');
    if (success) success.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Inline validation on blur ── */
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  /* ── Init ── */
  showStep(0);

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
});
