document.addEventListener('DOMContentLoaded', () => {
  const tryBtn   = document.getElementById('tryBtn');
  const timeBtn  = document.getElementById('timeBtn');
  const helloBtn = document.getElementById('helloBtn');
  const timeText = document.getElementById('timeText');
  const helloText = document.getElementById('helloText');
  const nameInput = document.getElementById('nameInput');

  tryBtn.addEventListener('click', () => {
    alert('Welcome to GlobalTalk 🎉');
  });

  timeBtn.addEventListener('click', async () => {
    timeText.textContent = 'Loading...';
    try {
      const res = await fetch('/api/time');
      const data = await res.json();
      timeText.textContent = `Server time: ${data.time}`;
    } catch (err) {
      timeText.textContent = 'Failed to load time.';
      console.error(err);
    }
  });

  helloBtn.addEventListener('click', async () => {
    const name = (nameInput.value || 'friend').trim();
    helloText.textContent = '...';
    try {
      const res = await fetch(`/api/hello/${encodeURIComponent(name)}`);
      const data = await res.json();
      helloText.textContent = data.message;
    } catch (err) {
      helloText.textContent = 'Failed to say hello.';
      console.error(err);
    }
  });
});