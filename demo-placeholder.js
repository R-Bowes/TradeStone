export const DEMO_MODE = true; // Toggle to false to disable demo placeholders

function ensureDemoModal() {
  let modal = document.getElementById('demo-modal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'demo-modal';
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center hidden';
  modal.innerHTML = `
    <div class="bg-white p-4 rounded w-80 space-y-2 text-center">
      <div id="demo-content"></div>
      <button id="demo-close" class="mt-2 px-4 py-1 bg-orange-500 text-white rounded">Close</button>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#demo-close').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  return modal;
}

export function showDemo(contentHtml) {
  if (!DEMO_MODE) return;
  const modal = ensureDemoModal();
  modal.querySelector('#demo-content').innerHTML = contentHtml;
  modal.classList.remove('hidden');
}
