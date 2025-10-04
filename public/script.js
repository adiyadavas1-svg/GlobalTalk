const $ = (sel) => document.querySelector(sel);

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}
async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

window.addEventListener('DOMContentLoaded', () => {
  $('#btnTime').addEventListener('click', async () => {
    const data = await getJSON('/api/time');
    $('#timeText').textContent = `🕒 ${data.time}`;
  });

  $('#btnJoke').addEventListener('click', async () => {
    const data = await getJSON('/api/joke');
    $('#jokeText').textContent = `😂 ${data.joke}`;
  });

  $('#btnQuote').addEventListener('click', async () => {
    const data = await getJSON('/api/quote');
    $('#quoteText').textContent = `💡 ${data.quote}`;
  });

  $('#btnCounter').addEventListener('click', async () => {
    const data = await getJSON('/api/counter');
    $('#counterText').textContent = `👀 Visits: ${data.visits}`;
  });

  $('#btnAvatar').addEventListener('click', async () => {
    const data = await getJSON('/api/avatar');
    $('#avatarImg').src = data.avatar;
    $('#avatarImg').style.display = 'block';
  });

  $('#btnWeather').addEventListener('click', async () => {
    const city = $('#cityInput').value.trim() || 'Delhi';
    const data = await getJSON(`/api/weather?city=${encodeURIComponent(city)}`);
    $('#weatherText').textContent = `🌤 Weather in ${data.city}: ${data.temp}`;
  });

  $('#btnHello').addEventListener('click', async () => {
    const name = $('#nameInput').value.trim() || 'friend';
    const data = await getJSON(`/api/hello/${encodeURIComponent(name)}`);
    $('#helloText').textContent = data.message;
  });

  $('#btnReverse').addEventListener('click', async () => {
    const t = $('#reverseInput').value.trim();
    const data = await getJSON(`/api/reverse?text=${encodeURIComponent(t)}`);
    $('#reverseText').textContent = `🔁 ${data.reversed}`;
  });

  $('#btnSum').addEventListener('click', async () => {
    const a = $('#sumA').value.trim();
    const b = $('#sumB').value.trim();
    try {
      const data = await getJSON(`/api/math/sum?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
      $('#sumText').textContent = `➕ ${data.a} + ${data.b} = ${data.sum}`;
    } catch {
      $('#sumText').textContent = 'Please enter valid numbers.';
    }
  });

  $('#btnTranslate').addEventListener('click', async () => {
    const t = $('#trInput').value.trim();
    const data = await getJSON(`/api/translate?text=${encodeURIComponent(t)}`);
    $('#trText').textContent = `🔤 ${data.translated}`;
  });

  $('#btnFeedback').addEventListener('click', async () => {
    $('#fbStatus').textContent = 'Saving...';
    const name = $('#fbName').value.trim();
    const message = $('#fbMsg').value.trim();
    if (!message) {
      $('#fbStatus').textContent = 'Message is required.';
      return;
    }
    try {
      await postJSON('/api/feedback', { name, message });
      $('#fbStatus').textContent = 'Thanks! Saved.';
      $('#fbMsg').value = '';
      await loadFeedback();
    } catch {
      $('#fbStatus').textContent = 'Error saving feedback.';
    }
  });

  loadFeedback();
});

async function loadFeedback() {
  const wrap = $('#fbList');
  wrap.innerHTML = 'Loading...';
  try {
    const data = await getJSON('/api/feedback');
    if (!data.items.length) {
      wrap.innerHTML = '<p>No feedback yet.</p>';
      return;
    }
    wrap.innerHTML = data.items.map(item => `
      <div class="fb">
        <div><strong>${item.name}</strong> <span>${new Date(item.at).toLocaleString()}</span></div>
        <div>${item.message}</div>
      </div>
    `).join('');
  } catch {
    wrap.innerHTML = '<p>Error loading feedback.</p>';
  }
}