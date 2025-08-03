export class ErrorMessage extends HTMLElement {
  connectedCallback() {
    this.classList.add('text-red-500', 'mt-2', 'text-center', 'hidden');
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'polite');
  }
  show(msg) {
    this.textContent = msg;
    this.classList.remove('hidden');
  }
  clear() {
    this.textContent = '';
    this.classList.add('hidden');
  }
}

customElements.define('error-message', ErrorMessage);
