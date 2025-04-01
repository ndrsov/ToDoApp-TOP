// Create DOM element with correct atributes
export function createEl(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);

  Object.keys(attributes).forEach((key) => {
    if (key === 'className') {
      element.className = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

// Remove child elements from parent element
export function clearEl(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Modal functions
export function showModal(modalid) {
  const modal = document.getElementById(modalid);
  modal.classList.add('active');
}

export function hideModal(modalid) {
  const modal = document.getElementById(modalid);
  modal.classList.remove('active');
}

// Generate unieu ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
