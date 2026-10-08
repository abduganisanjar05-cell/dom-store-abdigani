const store = new Store([
  { name: 'Basic Scooter', price: 3500, qty: 6 },
  { name: 'Electric Scooter', price: 5200, qty: 4 },
  { name: 'Premium Scooter', price: 7800, qty: 3 },
]);

const form = document.getElementById('product-form');
const tableBody = document.getElementById('product-table-body');
const totalValue = document.getElementById('total-value');
const validationErrors = {
  name: document.getElementById('name-error'),
  price: document.getElementById('price-error'),
  qty: document.getElementById('qty-error'),
};

function formatKzt(value) {
  return `${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} KZT`;
}

function clearFieldError(fieldName) {
  if (validationErrors[fieldName]) {
    validationErrors[fieldName].textContent = '';
  }
}

function setFieldError(fieldName, message) {
  if (validationErrors[fieldName]) {
    validationErrors[fieldName].textContent = message;
  }
}

function validateProductForm({ name, price, qty }) {
  const errors = {};

  if (!String(name).trim()) {
    errors.name = 'Name is required';
  }

  const priceValue = Number(price);
  if (!Number.isFinite(priceValue) || priceValue <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  const qtyText = typeof qty === 'string' ? qty.trim() : String(qty ?? '');
  const qtyValue = Number(qty);
  if (qtyText === '' || !Number.isFinite(qtyValue)) {
    errors.qty = 'Quantity must be a number';
  } else if (qtyValue < 0) {
    errors.qty = 'Quantity cannot be negative';
  }

  return errors;
}

function createCell(text, className) {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  return cell;
}

function renderProducts() {
  const products = store.products;
  tableBody.replaceChildren();

  if (!products.length) {
    const row = document.createElement('tr');
    const cell = createCell('No products available', 'empty-row');
    cell.colSpan = 4;
    row.append(cell);
    tableBody.append(row);
  } else {
    products.forEach((product) => {
      const row = document.createElement('tr');
      row.dataset.id = product.id;
      row.append(createCell(product.name));
      row.append(createCell(formatKzt(product.price)));

      const quantityCell = document.createElement('td');
      const controls = document.createElement('div');
      controls.className = 'quantity-controls';

      const decreaseButton = document.createElement('button');
      decreaseButton.type = 'button';
      decreaseButton.className = 'qty-btn';
      decreaseButton.dataset.action = 'decrease';
      decreaseButton.dataset.id = product.id;
      decreaseButton.setAttribute('aria-label', 'Decrease quantity');
      decreaseButton.textContent = '-';

      const quantity = document.createElement('span');
      quantity.textContent = product.qty;

      const increaseButton = document.createElement('button');
      increaseButton.type = 'button';
      increaseButton.className = 'qty-btn';
      increaseButton.dataset.action = 'increase';
      increaseButton.dataset.id = product.id;
      increaseButton.setAttribute('aria-label', 'Increase quantity');
      increaseButton.textContent = '+';

      controls.append(decreaseButton, quantity, increaseButton);
      quantityCell.append(controls);
      row.append(quantityCell);

      const actionsCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-btn';
      deleteButton.dataset.action = 'delete';
      deleteButton.dataset.id = product.id;
      deleteButton.textContent = 'Delete';
      actionsCell.append(deleteButton);
      row.append(actionsCell);

      tableBody.append(row);
    });
  }

  totalValue.textContent = formatKzt(store.total());
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = {
    name: form.elements.namedItem('name').value,
    price: form.elements.namedItem('price').value,
    qty: form.elements.namedItem('qty').value,
  };

  const errors = validateProductForm(formData);

  Object.keys(validationErrors).forEach((fieldName) => {
    clearFieldError(fieldName);
  });

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      setFieldError(fieldName, message);
    });
    return;
  }

  store.add({
    name: formData.name.trim(),
    price: Number(formData.price),
    qty: Number(formData.qty),
  });

  form.reset();
  renderProducts();
});

Object.keys(validationErrors).forEach((fieldName) => {
  const inputElement = form.elements.namedItem(fieldName);

  inputElement.addEventListener('input', () => {
    const errors = validateProductForm({
      name: form.elements.namedItem('name').value,
      price: form.elements.namedItem('price').value,
      qty: form.elements.namedItem('qty').value,
    });

    if (errors[fieldName]) {
      setFieldError(fieldName, errors[fieldName]);
    } else {
      clearFieldError(fieldName);
    }
  });
});

tableBody.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest('button') : null;

  if (!button || !tableBody.contains(button)) {
    return;
  }

  const { action, id } = button.dataset;
  const productId = Number(id);

  if (action === 'increase' && store.changeQuantity(productId, 1)) {
    renderProducts();
  } else if (action === 'decrease' && store.changeQuantity(productId, -1)) {
    renderProducts();
  } else if (action === 'delete' && store.remove(productId)) {
    renderProducts();
  }
});

renderProducts();
