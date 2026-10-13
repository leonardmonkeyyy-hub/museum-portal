const state = {
  character: null,
  scene: 'intro',
  inventory: [],
  world: null,
  paintings: {
    mona: { found: false },
    castle: { found: false },
    night: { found: false },
    village: { found: false }
  }
};

const sceneMap = {
  intro: {
    title: 'Museum Portal',
    body: 'Ты просыпаешься в школе. Впереди — большой автобус, потом музей, гид, странные картины и что-то, что связано с туманом и тайной. Кем ты хочешь быть?',
    className: 'intro',
    choices: [
      { label: 'Мальчик', action: () => chooseCharacter('мальчик') },
      { label: 'Девочка', action: () => chooseCharacter('девочка') }
    ]
  },
  school: {
    title: 'Школа',
    body: 'Под звуки тревожной тишины учитель объявляет: «Ребята, мы едем в музей искусства!» Ты садишься в большой автобус и едешь к зданию музея. Встречает тебя гид, который ведёт тебя через зал.',
    className: 'school',
    choices: [
      { label: 'Поехать в музей', action: () => setScene('museum') }
    ]
  },
  museum: {
    title: 'Музей',
    body: 'В музее всё кажется слишком тихим. Гид шепчет: «Не трогайте картины, просто смотрите». Вдруг в одном зале меркнет свет. Что-то странное происходит рядом с картиной Мона Лиза...',
    className: 'museum',
    choices: [
      { label: 'Подойти к галерее', action: () => setScene('gallery') }
    ]
  },
  gallery: {
    title: 'Главный зал',
    body: 'Перед тобой десятки картин. Каждая из них выглядит как портал. Нажми на любую, чтобы осмотреть её. Здесь можно исследовать комнаты и открывать новые миры.',
    className: 'gallery',
    choices: [
      { label: 'Осмотреть «Мона Лиза»', action: () => inspect('mona') },
      { label: 'Осмотреть «Синий замок»', action: () => inspect('castle') },
      { label: 'Осмотреть «Ночный замок»', action: () => inspect('night') },
      { label: 'Осмотреть «Деревню на закате»', action: () => inspect('village') },
      { label: 'Поговорить с гидом', action: () => talkToGuide() }
    ]
  },
  mona: {
    title: 'Мона Лиза',
    body: 'Ты подходишь к картине. Взгляд Моны кажется живым. Ты прикасаешься пальцем — вдруг картина будто рябь на воде. Рука проваливается в трепетание красок. Ты погружаешься внутрь самой картины...',
    className: 'mona',
    choices: [
      { label: 'Провалиться в страну живописи', action: () => enterWorld('mona') }
    ]
  },
  castle: {
    title: 'Синий замок',
    body: 'На фоне — глубокое небо и туман. Ты видишь замок, словно вымышленный. Внутри ждёт странный путь, где надо найти три нужных предмета и открыть путь дальше.',
    className: 'castle',
    choices: [
      { label: 'Зайти в замок', action: () => enterWorld('castle') }
    ]
  },
  night: {
    title: 'Ночной замок',
    body: 'Полночное небо, ветер, тёмные башни. Тьма держится здесь слишком долго. Что-то шевелится в окнах. Ты входишь в тайну ночного мира.',
    className: 'night',
    choices: [
      { label: 'Войти в ночь', action: () => enterWorld('night') }
    ]
  },
  village: {
    title: 'Деревня на закате',
    body: 'Деревня, как будто вырвавшаяся из старой книги. Костры, телеги, тёплый свет, и где-то вдалеке — старик с холстом и кистями.',
    className: 'village',
    choices: [
      { label: 'Подойти к деревне', action: () => enterWorld('village') }
    ]
  }
};

function updateHud() {
  const status = document.getElementById('status');
  const inventory = document.getElementById('inventory');

  const labels = {
    intro: 'Вступление',
    school: 'Школа',
    museum: 'Музей',
    gallery: 'Главный зал',
    mona: 'Мона Лиза',
    castle: 'Синий замок',
    night: 'Ночной замок',
    village: 'Деревня на закате'
  };

  status.textContent = `Сцена: ${labels[state.scene] || 'Пусто'}`;
  inventory.textContent = state.inventory.length ? `Инвентарь: ${state.inventory.join(', ')}` : 'Инвентарь: пусто';
}

function renderScene() {
  const sceneEl = document.getElementById('scene');
  const titleEl = document.getElementById('title');
  const storyEl = document.getElementById('story');
  const choicesEl = document.getElementById('choices');

  const scene = sceneMap[state.scene];
  if (!scene) return;

  sceneEl.className = `scene ${scene.className || ''}`;
  titleEl.textContent = scene.title;
  storyEl.textContent = scene.body;

  choicesEl.innerHTML = '';

  scene.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.textContent = choice.label;
    if (choice.label.includes('Вернуться') || choice.label.includes('Назад')) btn.classList.add('secondary');
    if (choice.label.includes('Сбежать') || choice.label.includes('Убежать')) btn.classList.add('danger');
    btn.addEventListener('click', choice.action);
    choicesEl.appendChild(btn);
  });

  updateHud();
}

function chooseCharacter(name) {
  state.character = name;
  state.scene = 'school';
  renderScene();
}

function setScene(sceneKey) {
  state.scene = sceneKey;
  renderScene();
}

function talkToGuide() {
  state.scene = 'museum';
  const guideText = 'Гид говорит: «Это просто сбой в электричестве. Всё нормально. Пожалуйста, оставайтесь здесь.» Ты чувствуешь, как тень на стене дрожит, словно кто-то шевелится за картиной.';

  const scene = sceneMap[state.scene];
  const storyEl = document.getElementById('story');
  storyEl.textContent = guideText + ' ' + scene.body;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = 'Вернуться в галерею';
  btn.addEventListener('click', () => setScene('gallery'));
  choicesEl.appendChild(btn);
  updateHud();
}

function inspect(paintingId) {
  state.scene = paintingId;
  renderScene();
}

function enterWorld(worldName) {
  state.world = worldName;
  state.scene = worldName;

  if (worldName === 'mona') {
    state.scene = 'mona';
    const text = 'Ты оказался в средневековой деревне рядом с Леонардо да Винчи. На земле лежат три тюбика с краской, которые нужно собрать, чтобы выйти обратно.';
    document.getElementById('story').textContent = text;
    createWorldButtons([
      { label: 'Искать первый тюбик', action: () => collectItem('тюбик синих красок') },
      { label: 'Искать второй тюбик', action: () => collectItem('тюбик жёлтой краски') },
      { label: 'Искать третий тюбик', action: () => collectItem('тюбик красной краски') },
      { label: 'Вернуться в галерею', action: () => returnToGallery() }
    ]);
    updateHud();
    return;
  }

  if (worldName === 'castle') {
    document.getElementById('story').textContent = 'На поляне стоит замок в тумане. Ты находишь факел, ключ и шлем. Нужно собрать их, чтобы открыть древние двери.';
    createWorldButtons([
      { label: 'Взять ключ', action: () => collectItem('ключ от замка') },
      { label: 'Взять факел', action: () => collectItem('факел') },
      { label: 'Взять шлем', action: () => collectItem('шлем рыцаря') },
      { label: 'Вернуться в галерею', action: () => returnToGallery() }
    ]);
    updateHud();
    return;
  }

  if (worldName === 'night') {
    document.getElementById('story').textContent = 'Ночь начинает дышать вокруг тебя. Вдали одинокая башня, у подножия — чёрный камень и странная лента света.';
    createWorldButtons([
      { label: 'Поднять чёрный камень', action: () => collectItem('чёрный камень') },
      { label: 'Осветить ленту', action: () => collectItem('светящаяся лента') },
      { label: 'Пробиться к башне', action: () => collectItem('ключ от башни') },
      { label: 'Вернуться в галерею', action: () => returnToGallery() }
    ]);
    updateHud();
    return;
  }

  if (worldName === 'village') {
    document.getElementById('story').textContent = 'В деревне тихо, но в воздухе уже видны следы прошлого — старик Леонардо улыбается, а рядом лежат краски, холст и смелость нового пути.';
    createWorldButtons([
      { label: 'Помочь художнику', action: () => collectItem('свиток художника') },
      { label: 'Осмотреть дом', action: () => collectItem('старинная кисть') },
      { label: 'Подняться к холму', action: () => collectItem('красный камень') },
      { label: 'Вернуться в галерею', action: () => returnToGallery() }
    ]);
    updateHud();
    return;
  }
}

function collectItem(item) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
  }

  const scene = sceneMap[state.scene] || sceneMap.gallery;
  document.getElementById('story').textContent = `Ты нашёл: ${item}. В твоём инвентаре становятся заметны новые предметы. ${scene.body}`;
  updateHud();

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  const back = document.createElement('button');
  back.textContent = 'Вернуться в галерею';
  back.addEventListener('click', () => returnToGallery());
  choicesEl.appendChild(back);
}

function createWorldButtons(actions) {
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  actions.forEach((action) => {
    const btn = document.createElement('button');
    btn.textContent = action.label;
    btn.addEventListener('click', action.action);
    choicesEl.appendChild(btn);
  });
}

function returnToGallery() {
  state.scene = 'gallery';
  state.world = null;
  renderScene();
}

renderScene();
