// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://vyuqjpdgrzdndpuxctsv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wpb5wIruSE-lsNO2ZqZkNQ_dDSBC6GJ';

async function salvarNoSupabase(tabela, dados) {
  const response = await fetch(SUPABASE_URL + '/rest/v1/' + tabela, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(dados)
  });
  return response.ok;
}

// ===== MENU MOBILE =====
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ===== BUSCA =====
function buscar() {
  var tipo = document.getElementById('tipo-busca') ? document.getElementById('tipo-busca').value : '';
  var cidade = document.getElementById('cidade-busca') ? document.getElementById('cidade-busca').value : '';
  var tipoImovel = document.getElementById('tipo-imovel') ? document.getElementById('tipo-imovel').value : '';
  var preco = document.getElementById('preco-max') ? document.getElementById('preco-max').value : '';

  if (tipo === 'servico') {
    window.location.href = 'prestadores.html';
    return;
  }

  var url = 'alugar.html?';
  if (cidade) url += 'cidade=' + encodeURIComponent(cidade) + '&';
  if (tipoImovel) url += 'tipo=' + encodeURIComponent(tipoImovel) + '&';
  if (preco) url += 'preco=' + preco;
  window.location.href = url;
}

// ===== RADIO BUTTONS =====
function setupRadios() {
  document.querySelectorAll('.radio-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var input = btn.querySelector('input');
      var name = input ? input.name : null;
      if (name) {
        document.querySelectorAll('.radio-btn').forEach(function(b) {
          var i = b.querySelector('input');
          if (i && i.name === name) b.classList.remove('selected');
        });
      }
      btn.classList.add('selected');
      if (input) input.checked = true;

      if (input && input.name === 'tipo_anuncio') {
        var aluguelFields = document.getElementById('campos-aluguel');
        if (aluguelFields) {
          aluguelFields.style.display = input.value === 'aluguel' ? 'block' : 'none';
        }
      }
    });
  });
}

// ===== CHECKBOXES =====
function setupCheckboxes() {
  document.querySelectorAll('.checkbox-item').forEach(function(item) {
    item.addEventListener('click', function() {
      item.classList.toggle('checked');
      var cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = !cb.checked;
    });
  });
}

// ===== UPLOAD DE FOTOS =====
function setupUpload(inputId, areaId, countId, minFotos) {
  var input = document.getElementById(inputId);
  var area = document.getElementById(areaId);
  var count = document.getElementById(countId);
  if (!input || !area) return;

  area.addEventListener('click', function() { input.click(); });
  area.addEventListener('dragover', function(e) { e.preventDefault(); area.style.borderColor = '#2563EB'; });
  area.addEventListener('dragleave', function() { area.style.borderColor = ''; });
  area.addEventListener('drop', function(e) {
    e.preventDefault();
    area.style.borderColor = '';
    input.files = e.dataTransfer.files;
    updateCount();
  });
  input.addEventListener('change', updateCount);

  function updateCount() {
    var n = input.files ? input.files.length : 0;
    if (count) {
      count.textContent = n + ' foto(s) selecionada(s)' + (minFotos ? ' (minimo ' + minFotos + ')' : '');
      count.style.color = n >= (minFotos || 0) ? '#16a34a' : '#F97316';
    }
  }
}

// ===== PROGRESSO DO FORMULARIO =====
function updateProgress() {
  var form = document.getElementById('form-anuncio') || document.getElementById('form-prestador');
  if (!form) return;

  var required = form.querySelectorAll('[required]');
  var filled = 0;
  required.forEach(function(f) { if (f.value.trim() !== '') filled++; });
  var pct = Math.round((filled / required.length) * 100);

  var bar = document.getElementById('progress-bar');
  var label = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
}

// ===== ENVIO DO FORMULARIO =====
async function validarEnviar(formId) {
  var form = document.getElementById(formId);
  if (!form) return;

  var required = form.querySelectorAll('[required]');
  var ok = true;

  required.forEach(function(f) {
    if (!f.value.trim()) {
      f.style.borderColor = '#ef4444';
      ok = false;
    } else {
      f.style.borderColor = '';
    }
  });

  var alertEl = document.getElementById('form-alert');
  if (!ok) {
    if (alertEl) alertEl.style.display = 'flex';
    window.scrollTo({ top: alertEl ? alertEl.offsetTop - 100 : 0, behavior: 'smooth' });
    return;
  }

  if (alertEl) alertEl.style.display = 'none';

  var btn = form.querySelector('.btn-submit');
  if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true; }

  function val(selector) {
    var el = form.querySelector(selector);
    return el ? el.value : '';
  }

  try {
    if (formId === 'form-anuncio') {
      var dados = {
        titulo: val('[name="titulo"]'),
        descricao: val('[name="descricao"]'),
        tipo_imovel: val('[name="tipo_imovel"]'),
        cidade: val('[name="cidade"]'),
        bairro: val('[name="bairro"]'),
        endereco: val('[name="endereco"]'),
        cep: val('[name="cep"]'),
        zona: val('[name="zona"]:checked'),
        metragem: val('[name="metragem"]'),
        quartos: val('[name="quartos"]'),
        banheiros: val('[name="banheiros"]'),
        vagas: val('[name="vagas"]'),
        tipo_anuncio: val('[name="tipo_anuncio"]:checked'),
        valor: val('[name="valor"]'),
        negociacao: val('[name="negociacao"]:checked'),
        proximidades: val('[name="proximidades"]'),
        nome: val('[name="nome"]'),
        telefone: val('[name="telefone"]'),
        email: val('[name="email"]'),
        tipo_anunciante: val('[name="tipo_anunciante"]:checked'),
        status: 'ativo'
      };

      var sucesso = await salvarNoSupabase('imoveis', dados);
      if (sucesso) {
        if (btn) btn.textContent = 'Enviado com sucesso!';
        alert('Anuncio publicado! Seu imovel ja esta disponivel no Portal Araripe.');
        form.reset();
        updateProgress();
        var msg = 'Novo anuncio no Portal Araripe! Nome: ' + dados.nome + ' Telefone: ' + dados.telefone + ' Imovel: ' + dados.titulo + ' Cidade: ' + dados.cidade + ' Valor: R$ ' + dados.valor;
        window.open('https://wa.me/5588994893176?text=' + encodeURIComponent(msg), '_blank');
      } else {
        throw new Error('Erro ao salvar');
      }

    } else if (formId === 'form-prestador') {
      var dados = {
        nome: val('[name="nome"]'),
        tipo_cadastro: val('[name="tipo_cadastro"]:checked'),
        documento: val('[name="documento"]'),
        telefone: val('[name="telefone"]'),
        email: val('[name="email"]'),
        cidade: val('[name="cidade"]'),
        experiencia: val('[name="experiencia"]'),
        categoria: val('[name="categoria"]'),
        especialidades: val('[name="especialidades"]'),
        area_atendimento: val('[name="area_atendimento"]'),
        descricao: val('[name="descricao"]'),
        forma_cobranca: val('[name="forma_cobranca"]'),
        valor_minimo: val('[name="valor_minimo"]'),
        orcamento_gratis: val('[name="orcamento_gratis"]:checked'),
        instagram: val('[name="instagram"]'),
        plano: val('[name="plano"]:checked'),
        status: 'ativo'
      };

      var sucesso = await salvarNoSupabase('prestadores', dados);
      if (sucesso) {
        if (btn) btn.textContent = 'Enviado com sucesso!';
        alert('Cadastro publicado! Voce ja esta disponivel no Portal Araripe.');
        form.reset();
        updateProgress();
        var msg = 'Novo prestador no Portal Araripe! Nome: ' + dados.nome + ' Telefone: ' + dados.telefone + ' Categoria: ' + dados.categoria + ' Cidade: ' + dados.cidade + ' Plano: ' + dados.plano;
        window.open('https://wa.me/5588994893176?text=' + encodeURIComponent(msg), '_blank');
      } else {
        throw new Error('Erro ao salvar');
      }
    }

  } catch (err) {
    if (btn) { btn.textContent = 'Enviar'; btn.disabled = false; }
    alert('Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  setupRadios();
  setupCheckboxes();
  setupUpload('fotos-input', 'fotos-area', 'fotos-count', 8);
  setupUpload('fotos-prestador', 'area-prestador', 'count-prestador', 3);

  document.querySelectorAll('input, select, textarea').forEach(function(el) {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
  });

  updateProgress();
});
