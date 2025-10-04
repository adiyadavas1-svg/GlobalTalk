const $ = (sel) => document.querySelector(sel);

// on ready
window.addEventListener('DOMContentLoaded', () => {
  $('#btnTry').addEventListener('click', () => {
    alert('Welcome to GlobalTalk 🎉');
  });

  $('#btnTime').addEventListener('click', async () => {
    clearMessages();
    try {
      const res = await fetch('/api/time');
      const data = await res.json();
      $('#timeText').textContent = `Server time: ${data.time}`;
    } catch (err) {
      showError(err);
    }
  });

  $('#btnHello').addEventListener('click', async () => {
    clearMessages();
    const name = $('#nameInput').value.trim() || 'friend';
    try {
      const res = await fetch(`/api/hello/${encodeURIComponent(name)}`);
      const data = await res.json();
      $('#helloText').textContent = data.message;
    } catch (err) {
      showError(err);
    }
  });

  // NEW: Get Joke
  $('#btnJoke').addEventListener('click', async () => {
    clearMessages();
    try {
      const res = await fetch('/api/joke');
      const data = await res.json();
      $('#jokeText').textContent = `😂 ${data.joke}`;
    } catch (err) {
      showError(err);
    }
  });
});

function clearMessages() {
  $('#timeText').textContent = '';
  $('#helloText').textContent = '';
  $('#jokeText').textContent = '';
  $('#errorText').textContent = '';
}

function showError(err) {
  $('#errorText').textContent = `Error: ${err.message || err}`;
}