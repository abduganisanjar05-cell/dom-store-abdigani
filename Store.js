class Store {
  #products = [];
  #nextId = 1;

  constructor(initialProducts = []) {
    initialProducts.forEach((product) => this.add(product));
  }

  add(product) {
    if (!product || typeof product !== 'object') {
      throw new Error('Product must be an object');
    }

    const name = typeof product.name === 'string' ? product.name.trim() : '';
    const price =
      typeof product.price === 'number' || typeof product.price === 'string'
        ? Number(product.price)
        : Number.NaN;
    const quantityText =
      typeof product.qty === 'string' ? product.qty.trim() : String(product.qty ?? '');
    const qty =
      typeof product.qty === 'number' || typeof product.qty === 'string'
        ? Number(product.qty)
        : Number.NaN;

    if (!name) {
      throw new Error('Name is required');
    }

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (!quantityText || !Number.isFinite(qty)) {
      throw new Error('Quantity must be a number');
    }

    if (qty < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const newProduct = {
      id: this.#nextId++,
      name,
      price,
      qty,
    };

    this.#products.push(newProduct);
    return { ...newProduct };
  }

  remove(identifier) {
    const index = this.#products.findIndex((product) =>
      typeof identifier === 'number'
        ? product.id === identifier
        : typeof identifier === 'string' &&
          product.name.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (index === -1) {
      return false;
    }

    this.#products.splice(index, 1);
    return true;
  }

  find(query) {
    if (typeof query === 'number') {
      return this.#copyProduct(this.#products.find((product) => product.id === query));
    }

    if (typeof query === 'string') {
      const name = query.trim().toLowerCase();
      return this.#copyProduct(
        this.#products.find((product) => product.name.toLowerCase() === name)
      );
    }

    return null;
  }

  changeQuantity(id, amount) {
    const product = this.#products.find((item) => item.id === id);

    if (!product || !Number.isFinite(amount)) {
      return false;
    }

    const newQuantity = product.qty + amount;
    if (newQuantity < 0) {
      return false;
    }

    product.qty = newQuantity;
    return true;
  }

  total() {
    return this.#products.reduce((sum, product) => sum + product.price * product.qty, 0);
  }

  get products() {
    return this.#products.map((product) => ({ ...product }));
  }

  #copyProduct(product) {
    return product ? { ...product } : null;
  }
}

if (typeof window !== 'undefined') {
  window.Store = Store;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Store };
}
