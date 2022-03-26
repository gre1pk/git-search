const searchInput = document.querySelector('.input-search');
const repoContainer = document.querySelector('.container');

let arrRepo = [];

const getRepositories = async (text) => {
  const url = `https://api.github.com/search/repositories?q=${text}`;
  try {
    const respons = await fetch(url);
    const repositories = await respons.json();
    arrRepo = repositories.items;
    autoComplete(arrRepo);
  } catch (err) {
    throw new Error(err);
  }
};

const debounce = (fn, ms) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
};
const onCange = (e) => {
  if (searchInput.value.length < 1) {
    autoComplete();
  }
  if (
    /^[a-zA-Zа-яёА-ЯЁ]+(?:[\s.-][a-zA-Zа-яёА-ЯЁ]+)*$/.test(searchInput.value)
  ) {
    getRepositories(e.target.value);
  }
};

const getElOnId = (arr, id) => {
  return arr.filter((e) => e.id === +id);
};

const cangeValue = debounce(onCange, 300);

const createElement = (tag, elementClass) => {
  const element = document.createElement(tag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
};

const autoComplete = (arrRepo = []) => {
  const completContainer = document.querySelector('.input-search__list');
  const maxRepo = arrRepo.length > 5 ? 5 : arrRepo.length;
  completContainer.innerHTML = '';
  const repos = arrRepo.slice(0, maxRepo);
  repos.forEach((e) => {
    const repo = createElement('li', 'input-search__item');
    repo.textContent = e.name;
    repo.setAttribute('id', e.id);
    completContainer.append(repo);
  });
};

const seveRepo = ({ id, name, owner, stargazers_count }) => {
  const markedContainer = document.querySelector('.marked__list');
  const item = createElement('li', 'marked__item');
  const itemInfo = createElement('div', 'marked__item-text');
  const btn = createElement('button', 'delette-btn');
  itemInfo.innerText = `Name: ${name} \n Owner: ${owner.login} \n Stars: ${stargazers_count}`;
  markedContainer.append(item);
  item.setAttribute('id', id);
  item.append(itemInfo);
  item.append(btn);
};

searchInput.addEventListener('keyup', cangeValue);

repoContainer.addEventListener('click', (e) => {
  if (e.target.classList.value === 'input-search__item') {
    const repo = getElOnId(arrRepo, e.target.getAttribute('id'));
    seveRepo(...repo);
    searchInput.value = '';
    autoComplete();
  }

  if (e.target.classList.value === 'delette-btn') {
    e.target.parentNode.remove();
  }
});
