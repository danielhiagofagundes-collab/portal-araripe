// ===== MENU MOBILE =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ===== BUSCA =====
function buscar() {
  const tipo = document.getElementById('tipo-busca')?.value;
  const cidade = document.getElementById('cidade-busca')?.value;
  const tipoImovel = document.getElementById('tipo-imovel')?.value;
  const preco = document.getElementById('preco-max')?.value;

  if (tipo === 'servico') {
    window.location.href = 'prestadores.html';
    return;
  }
  
  let url = 'alugar.html?';
  if (cidade) url += `cidade=${encodeURIComponent(cidade)}&`;
  if (tipoImovel) url += `tipo=${encodeURIComponent(tipoImovel)}&`;
  if (preco) url += `preco=${preco}`;
  window.location.href = url;
}

// ===== RADIO BUTTONS =====
function setupRadios() {
  document.querySelectorAll('.radio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.querySelector('input')?.name;
      if (name) {
        document.querySelectorAll(`.radio-btn input[name="${name}"]`).forEach(r => {
          r.closest('.radio-btn').classList.remove('selected');
        });
      }
      btn.classList.add('selected');
      const input = btn.querySelector('input');
      if (input) input.checked = true;
      
      // Mostrar/ocultar campos de aluguel
      if (input?.name === 'tipo_anuncio') {
        const aluguelFields = document.getElementById('campos-aluguel');
        if (aluguelFields) {
          aluguelFields.style.display = input.value === 'aluguel' ? 'block' : 'none';
        }
      }
    });
  });
}

// ===== CHECKBOXES =====
function setupCheckboxes() {
  document.querySelectorAll('.checkbox-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = !cb.checked;
    });
  });
}

// ===== UPLOAD DE FOTOS =====
function setupUpload(inputId, areaId, countId, minFotos) {
  const input = document.getElementById(inputId);
  const area = document.getElementById(areaId);
  const count = document.getElementById(countId);
  if (!input || !area) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = '#2563EB'; });
  area.addEventListener('dragleave', () => area.style.borderColor = '');
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.style.borderColor = '';
    input.files = e.dataTransfer.files;
    updateCount();
  });

  input.addEventListener('change', updateCount);

  function updateCount() {
    const n = input.files?.length || 0;
    if (count) {
      count.textContent = `${n} foto(s) selecionada(s) ${minFotos ? `(mínimo ${minFotos})` : ''}`;
      count.style.color = n >= (minFotos || 0) ? '#16a34a' : '#F97316';
    }
  }
}

// ===== PROGRESSO DO FORMULÁRIO =====
function updateProgress() {
  const form = document.getElementById('form-anuncio') || document.getElementById('form-prestador');
  if (!form) return;
  
  const required = form.querySelectorAll('[required]');
  const filled = Array.from(required).filter(f => f.value.trim() !== '').length;
  const pct = Math.round((filled / required.length) * 100);
  
  const bar = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
}

// ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO =====
function validarEnviar(formId, destino) {
  const form = document.getElementById(formId);
  if (!form) return;

  const required = form.querySelectorAll('[required]');
  let ok = true;
  
  required.forEach(f => {
    if (!f.value.trim()) {
      f.style.borderColor = '#ef4444';
      ok = false;
    } else {
      f.style.borderColor = '';
    }
  });

  const alertEl = document.getElementById('form-alert');
  if (!ok) {
    if (alertEl) alertEl.style.display = 'flex';
    window.scrollTo({ top: alertEl?.offsetTop - 100 || 0, behavior: 'smooth' });
    return;
  }

  if (alertEl) alertEl.style.display = 'none';
  
  // Redireciona para WhatsApp com os dados
  const titulo = form.querySelector('[name="titulo"]')?.value || '';
  const cidade = form.querySelector('[name="cidade"]')?.value || '';
  const telefone = form.querySelector('[name="telefone"]')?.value || '';
  
  const msg = `Olá! Quero cadastrar meu anúncio no Portal Araripe.\n\n📋 *Título:* ${titulo}\n📍 *Cidade:* ${cidade}\n📞 *Telefone:* ${telefone}\n\nGostaria de mais informações sobre como publicar meu anúncio.`;
  
  const wpp = `https://wa.me/5588999999999?text=${encodeURIComponent(msg)}`;
  window.open(wpp, '_blank');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setupRadios();
  setupCheckboxes();
  setupUpload('fotos-input', 'fotos-area', 'fotos-count', 8);
  setupUpload('fotos-prestador', 'area-prestador', 'count-prestador', 3);
  
  // Atualiza progresso ao digitar
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
  });
  
  updateProgress();
});
