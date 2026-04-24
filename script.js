// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://vyuqjpdgrzdndpuxctsv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wpb5wIruSE-lsNO2ZqZkNQ_dDSBC6GJ';

async function salvarNoSupabase(tabela, dados) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(dados)
  });
  return response.ok;
}

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

// ===== ENVIO DO FORMULÁRIO DE IMÓVEL =====
async function validarEnviar(formId) {
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

  const btn = form.querySelector('.btn-submit');
  if (btn) { btn.textContent = '⏳ Enviando...'; btn.disabled = true; }

  try {
    if (formId === 'form-anuncio') {
      const dados = {
        titulo: form.querySelector('[name="titulo"]')?.value || '',
        descricao: form.querySelector('[name="descricao"]')?.value || '',
        tipo_imovel: form.querySelector('[name="tipo_imovel"]')?.value || '',
        cidade: form.querySelector('[name="cidade"]')?.value || '',
        bairro: form.querySelector('[name="bairro"]')?.value || '',
        endereco: form.querySelector('[name="endereco"]')?.value || '',
        cep: form.querySelector('[name="cep"]')?.value || '',
        zona: form.querySelector('[name="zona"]:checked')?.value || '',
        metragem: form.querySelector('[name="metragem"]')?.value || '',
        quartos: form.querySelector('[name="quartos"]')?.value || '',
        banheiros: form.querySelector('[name="banheiros"]')?.value || '',
        vagas: form.querySelector('[name="vagas"]')?.value || '',
        tipo_anuncio: form.querySelector('[name="tipo_anuncio"]:checked')?.value || '',
        valor: form.querySelector('[name="valor"]')?.value || '',
        negociacao: form.querySelector('[name="negociacao"]:checked')?.value || '',
        proximidades: form.querySelector('[name="proximidades"]')?.value || '',
        nome: form.querySelector('[name="nome"]')?.value || '',
        telefone: form.querySelector('[name="telefone"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        tipo_anunciante: form.querySelector('[name="tipo_anunciante"]:checked')?.value || '',
        status: 'pendente'
      };

      const sucesso = await salvarNoSupabase('imoveis', dados);

      if (sucesso) {
        if (btn) { btn.textContent = '✅ Enviado com sucesso!'; }
        alert('✅ Anúncio recebido! Nossa equipe entrará em contato em até 24h para confirmar a publicação.');
        form.reset();
        updateProgress();

        // Notifica no WhatsApp
        const msg = `🏠 *Novo anúncio recebido no Portal Araripe!*\n\n👤 *Nome:* ${dados.nome}\n📞 *Telefone:* ${dados.telefone}\n🏡 *Imóvel:* ${dados.titulo}\n📍 *Cidade:* ${dados.cidade}\n💰 *Valor:* R$ ${dados.valor}`;
        window.open(`https://wa.me/5588994893176?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        throw new Error('Erro ao salvar');
      }

    } else if (formId === 'form-prestador') {
      const dados = {
        nome: form.querySelector('[name="nome"]')?.value || '',
        tipo_cadastro: form.querySelector('[name="tipo_cadastro"]:checked')?.value || '',
        documento: form.querySelector('[name="documento"]')?.value || '',
        telefone: form.querySelector('[name="telefone"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        cidade: form.querySelector('[name="cidade"]')?.value || '',
        experiencia: form.querySelector('[name="experiencia"]')?.value || '',
        categoria: form.querySelector('[name="categoria"]')?.value || '',
        especialidades: form.querySelector('[name="especialidades"]')?.value || '',
        area_atendimento: form.querySelector('[name="area_atendimento"]')?.value || '',
        descricao: form.querySelector('[name="descricao"]')?.value || '',
        forma_cobranca: form.querySelector('[name="forma_cobranca"]')?.value || '',
        valor_minimo: form.querySelector('[name="valor_minimo"]')?.value || '',
        orcamento_gratis: form.querySelector('[name="orcamento_gratis"]:checked')?.value || '',
        instagram: form.querySelector('[name="instagram"]')?.value || '',
        plano: form.querySelector('[name="plano"]:checked')?.value || '',
        status: 'pendente'
      };

      const sucesso = await salvarNoSupabase('prestadores', dados);

      if (sucesso) {
        if (btn) { btn.textContent = '✅ Enviado com sucesso!'; }
        alert('✅ Cadastro recebido! Nossa equipe entrará em contato em até 24h para confirmar seu cadastro.');
        form.reset();
        updateProgress();

        // Notifica no WhatsApp
        const msg = `👷 *Novo prestador cadastrado no Portal Araripe!*\n\n👤 *Nome:* ${dados.nome}\n📞 *Telefone:* ${dados.telefone}\n🔧 *Categoria:* ${dados.categoria}\n📍 *Cidade:* ${dados.cidade}\n⭐ *Plano:* ${dados.plano}`;
        window.open(`https://wa.me/5588994893176?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        throw new Error('Erro ao salvar');
      }
    }
  } catch (err) {
    if (btn) { btn.textContent = '✅ Enviar'; btn.disabled = false; }
    alert('❌ Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setupRadios();
  setupCheckboxes();
  setupUpload('fotos-input', 'fotos-area', 'fotos-count', 8);
  setupUpload('fotos-prestador', 'area-prestador', 'count-prestador', 3);

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
  });

  updateProgress();
});
