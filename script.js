// ChapelHub starter: front-end only. Browser data is local to each device.
const content = document.querySelector('#content');
const STORAGE_PREFIX = 'chapelhub-v1-';
const load = (key, fallback) => { try { const raw = localStorage.getItem(STORAGE_PREFIX + key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year:'numeric',month:'2-digit',day:'2-digit' }).format(new Date());
const safe = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const views = {
  home: () => `
    <section class="hero"><div class="eyebrow">The student-made Chapel app</div><h1>Welcome to ChapelHub 💙</h1><p>What's happening at Chapel? Your favorite school-life tools, all in one place.</p></section>
    <div class="notice">🚧 This is a working prototype. Ratings, votes and posts are saved only in your own browser for now; other students cannot see them yet.</div>
    <section class="card-grid" aria-label="Explore features">
      ${[['lunch','🍴','Lunch Ratings',"See a sample menu and rate today's lunch"],['poll','🗳️','Daily Poll','Vote on fun school-life questions'],['lost','🔎','Lost & Found','Post and search for missing items'],['challenge','🏆','Trojan Challenge','Try the daily question and build a streak']].map(([id,emoji,title,desc])=>`<button class="feature" data-page="${id}"><span class="emoji">${emoji}</span><h2>${title}</h2><p>${desc}</p></button>`).join('')}
    </section>`,
  lunch: () => {
    const data = load('ratings', []);
    const mine = data.find(r => r.date === today());
    const history = data.length ? `<div class="item-list">${data.slice().reverse().slice(0,6).map(r=>`<div class="item"><strong>${safe(r.date)}</strong>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}${r.comment ? `<p>${safe(r.comment)}</p>` : ''}</div>`).join('')}</div>` : '<p class="empty">No ratings yet.</p>';
    return shell('🍴 Lunch Ratings', 'See what students think of lunch — starting with your own ratings.', `
      <div class="panel"><span class="pill">Today · ${safe(today())}</span><h2 style="margin-top:15px">Lunch menu</h2><p class="muted">Menu not connected yet. Add the real cafeteria menu when you get permission to use it.</p></div>
      <div class="panel"><h2>How was lunch today?</h2><p class="muted small">${mine ? 'You can update your rating.' : 'Select a rating and add an optional comment.'}</p>
        <div class="stars" role="group" aria-label="Rate lunch">${[1,2,3,4,5].map(n=>`<button class="star ${mine?.rating===n?'active':''}" data-rating="${n}" aria-label="${n} stars">★</button>`).join('')}</div>
        <label class="form-grid" style="margin-top:15px">Optional comment <textarea id="lunch-comment" maxlength="200" placeholder="What did you think?">${safe(mine?.comment || '')}</textarea></label>
        <p class="note">Comments stay on your device in this prototype.</p><button class="primary" id="save-rating" ${mine ? '' : 'disabled'}>Save rating</button>
      </div><div class="panel"><h2>Your recent ratings</h2>${history}</div>`);
  },
  poll: () => {
    const options = ['More themed spirit days 🎉','More sports tournaments ⚽','More lunchtime activities 🎲','More school talent shows 🎤'];
    const response = load('poll-'+today(), null);
    return shell('🗳️ Daily Poll', 'One question every day. Have your say!', `
      <div class="panel"><span class="pill">Daily question · ${safe(today())}</span><h2 style="margin-top:15px">What school activity would you like to see more of?</h2>
      ${response===null ? `${options.map((o,i)=>`<button class="poll-option" data-vote="${i}"><span>${o}</span><span>Vote →</span></button>`).join('')}<p class="note">Demo poll: voting is stored on this browser only.</p>` : `<p class="result">Your vote: <strong>${options[response]}</strong> 🎉</p><p class="muted small">In the published version, students' votes will be aggregated in a shared database.</p>${options.map((o,i)=>`<div class="flex space-between"><span>${o}</span>${response===i?'✓':''}</div><div class="bar"><div style="width:${response===i?100:0}%"></div></div>`).join('')}`}
      </div>`);
  },
  lost: () => {
    const items = load('lost-items', []);
    return shell('🔎 Lost & Found', 'A simple way to report lost or found belongings.', `
      <div class="notice">For a real school launch: get staff approval, moderate posts, and arrange item returns through an approved school office. Do not publish student contact information.</div>
      <div class="panel"><h2>Post an item</h2>
        <form id="lost-form" class="form-grid"><label>Status<select name="status"><option>Lost</option><option>Found</option></select></label><label>Item name<input name="name" required maxlength="60" placeholder="Blue water bottle" /></label><label>Description<textarea name="description" maxlength="200" required placeholder="Color, brand, distinguishing details..."></textarea></label><label>General location (optional)<input name="location" maxlength="80" placeholder="Gym / library / cafeteria" /></label><button class="primary" type="submit">Post item</button></form>
      </div><div class="panel"><h2>Recent posts (${items.length})</h2><label class="form-grid">Search items<input id="item-search" placeholder="Search by item or location" /></label><div id="item-results" class="item-list"></div><p class="note">These demo posts are visible only on your device.</p></div>`);
  },
  challenge: () => {
    // You can replace or expand these questions! Everyone gets the same question on the same day.
    const questions = [
      {question:'What do you call a word that reads the same backward and forward?', options:['Anagram','Palindrome','Acronym','Homonym'], answer:1},
      {question:'Which planet has the most prominent ring system?', options:['Mars','Earth','Saturn','Mercury'], answer:2},
      {question:'How many colors are in a classic rainbow?', options:['5','6','7','8'], answer:2},
      {question:'In computing, what does HTML stand for?', options:['HyperText Markup Language','High Transfer Machine Logic','Home Tool Markup Language','Hyperlink Text Main List'], answer:0},
      {question:'Which ocean is the largest?', options:['Arctic','Indian','Atlantic','Pacific'], answer:3},
    ];
    const dateIndex = Math.floor(Date.parse(today()+'T12:00:00Z')/86400000)%questions.length;
    const q = questions[dateIndex];
    const history = load('challenge-history', {});
    const answer = history[today()];
    const daysWon = Object.entries(history).filter(([date,choice])=>{
      const i=Math.floor(Date.parse(date+'T12:00:00Z')/86400000)%questions.length;
      return questions[i]?.answer===choice;
    }).length;
    return shell('🏆 Trojan Challenge', 'A new mini challenge every day!', `
      <div class="panel"><span class="pill">Today's challenge · ${safe(today())}</span><h2 style="margin-top:15px">${safe(q.question)}</h2>
      ${answer===undefined ? `<div class="quiz-options">${q.options.map((o,i)=>`<button data-answer="${i}">${safe(o)}</button>`).join('')}</div>` : `<div class="result">${answer===q.answer ? '🎉 Correct! Great job!' : `Good try! Correct answer: ${safe(q.options[q.answer])}`}</div>`}
      <p class="note">One attempt per day in this browser. Questions repeat after five days until you add more.</p></div><div class="panel"><h2>Your stats</h2><div class="stat">${daysWon} ✓</div><p class="muted">Total correct days on this device</p></div>`);
  }
};
function shell(title, description, inner) {return `<section class="section-header"><div><button class="back" data-page="home">← Home</button><h1>${title}</h1><p>${description}</p></div></section>${inner}`;}
let pendingRating = null;
function render(page='home') {
  const current = Object.hasOwn(views,page) ? page:'home';
  content.innerHTML = views[current]();
  window.scrollTo(0,0);
  if(current==='lunch') { pendingRating=load('ratings',[]).find(r=>r.date===today())?.rating||null; bindLunch(); }
  if(current==='lost') bindLost();
  if(current==='challenge') bindChallenge();
  if(current==='poll') bindPoll();
}
document.addEventListener('click',e => {const btn=e.target.closest('[data-page]');if(btn) render(btn.dataset.page);});
function bindLunch() {
  document.querySelectorAll('[data-rating]').forEach(btn=>btn.addEventListener('click',()=>{
    pendingRating=Number(btn.dataset.rating);document.querySelectorAll('[data-rating]').forEach(b=>b.classList.toggle('active',Number(b.dataset.rating)===pendingRating));document.querySelector('#save-rating').disabled=false;
  }));
  document.querySelector('#save-rating').addEventListener('click',()=>{
    if(!pendingRating)return;
    let entries=load('ratings',[]).filter(r=>r.date!==today());
    entries.push({date:today(),rating:pendingRating,comment:document.querySelector('#lunch-comment').value.trim().slice(0,200)});
    save('ratings',entries);render('lunch');
  });
}
function bindPoll() {document.querySelectorAll('[data-vote]').forEach(btn=>btn.addEventListener('click',()=>{save('poll-'+today(),Number(btn.dataset.vote));render('poll');}));}
function bindLost(){
  document.querySelector('#lost-form').addEventListener('submit',e=>{
    e.preventDefault();const values=new FormData(e.currentTarget);
    const post={id:Date.now(),date:today(),status:String(values.get('status')),name:String(values.get('name')).trim().slice(0,60),description:String(values.get('description')).trim().slice(0,200),location:String(values.get('location')).trim().slice(0,80)};
    if(!post.name||!post.description)return;
    save('lost-items',[post,...load('lost-items',[])]);render('lost');
  });
  const input=document.querySelector('#item-search');
  const results=document.querySelector('#item-results');
  function update(){const query=input.value.toLowerCase();const posts=load('lost-items',[]).filter(x=>[x.name,x.description,x.location].join(' ').toLowerCase().includes(query));
    results.innerHTML=posts.length?posts.map(x=>`<article class="item"><span class="pill">${safe(x.status)}</span> <span class="small muted">${safe(x.date)}</span><strong style="margin-top:10px">${safe(x.name)}</strong><p>${safe(x.description)}</p>${x.location?`<p class="small muted">📍 ${safe(x.location)}</p>`:''}<button class="secondary" data-delete="${x.id}">Remove my demo post</button></article>`).join(''):'<p class="empty">No matching items found.</p>';
    results.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{save('lost-items',load('lost-items',[]).filter(x=>String(x.id)!==btn.dataset.delete));update();}));
  }
  input.addEventListener('input',update);update();
}
function bindChallenge(){document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{const history=load('challenge-history',{});if(history[today()]!==undefined)return;history[today()]=Number(btn.dataset.answer);save('challenge-history',history);render('challenge');}));}
render();
