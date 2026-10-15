const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const designs = {
 natur: {name: 'Löv & form.', title: 'Nära naturen.\nGenomtänkt i detalj.'},
 studio: {name: 'Studio Forma.', title: 'Idéer med karaktär.\nForm med omtanke.'},
 teknik: {name: 'Nord Teknik.', title: 'Teknik som fungerar.\nHjälp nära till hands.'}
};
document.querySelectorAll('[data-design]').forEach(button => {
 button.addEventListener('click', () => {
  const key = button.dataset.design;
  const design = designs[key];
  if (!design) return;
  document.querySelector('.web-preview').dataset.theme = key;
  document.querySelector('#demo-name').textContent = design.name;
  document.querySelector('#demo-title').textContent = design.title;
  document.querySelectorAll('[data-design]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 });
});
