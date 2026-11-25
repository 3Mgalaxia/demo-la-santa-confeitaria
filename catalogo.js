const cards = [...document.querySelectorAll('article[data-name]')];
const names = cards.map(card => card.dataset.name);
const counts = new Map(names.map(name => [name, 0]));
let group = 'Todos';
const search = document.querySelector('#search');
function filter() {
  let visible = 0;
  for (const card of cards) {
    card.hidden = (group !== 'Todos' && card.dataset.group !== group) || !card.dataset.name.toLowerCase().includes(search.value.trim().toLowerCase());
    if (!card.hidden) visible++;
  }
  document.querySelector('#notice').textContent = visible ? '' : 'Nenhum doce encontrado. Experimente outro nome ou categoria.';
}
search.addEventListener('input', filter);
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
  group = button.textContent;
  document.querySelectorAll('.filters button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  filter();
}));
const message = document.querySelector('#msg');
function update() {
  const lines = names.filter(name => counts.get(name)).map(name => counts.get(name) + ' × ' + name);
  message.value = lines.length ? 'Olá, La Santa! Gostaria de consultar valores e disponibilidade para:\n' + lines.join('\n') : 'Olá, La Santa! Gostaria de consultar o preçário.';
  document.querySelector('#total').textContent = [...counts.values()].reduce((sum, value) => sum + value, 0);
  for (const row of document.querySelectorAll('.row')) {
    const value = counts.get(row.dataset.item);
    row.querySelector('output').value = value;
    row.querySelector('button').disabled = value === 0;
  }
}
function change(name, delta) {
  counts.set(name, Math.max(0, counts.get(name) + delta));
  document.querySelector('#feedback').textContent = '';
  update();
}
for (const name of names) {
  const row = document.createElement('div');
  row.className = 'row';
  row.dataset.item = name;
  row.innerHTML = '<strong></strong><button type="button">−</button><output>0</output><button type="button">+</button>';
  row.querySelector('strong').textContent = name;
  row.querySelectorAll('button').forEach((button, i) => {
    button.setAttribute('aria-label', (i ? 'Adicionar ' : 'Remover ') + name);
    button.onclick = () => change(name, i ? 1 : -1);
  });
  document.querySelector('#rows').append(row);
}
document.querySelectorAll('[data-add]').forEach(button => button.onclick = () => {
  change(button.dataset.add, 1);
  document.querySelector('#notice').textContent = button.dataset.add + ' na seleção: ' + counts.get(button.dataset.add);
});
document.querySelector('#copy').onclick = async () => {
  try { await navigator.clipboard.writeText(message.value); document.querySelector('#feedback').textContent = 'Mensagem copiada. Cole no direct da La Santa.'; }
  catch { message.focus(); message.select(); document.querySelector('#feedback').textContent = 'Texto selecionado. Use Copiar no seu dispositivo.'; }
};
update();
