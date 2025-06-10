export async function loadHeader() {
  const container = document.getElementById('header');
  if (!container) return;
  try {
    const res = await fetch('header.html');
    container.innerHTML = await res.text();
    const btn = container.querySelector('#burger-btn');
    const menu = container.querySelector('#burger-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('translate-x-full');
        menu.classList.toggle('hidden');
      });
    }
  } catch (err) {
    console.error('Failed to load header:', err);
  }
}
