import { describe, expect, it } from 'vitest';
import { Store } from '../src/Store.js';

describe('Store', () => {
  it('starts with no products', () => {
    const store = new Store();

    expect(store.products).toEqual([]);
  });

  it('adds a product and trims its name', () => {
    const store = new Store();

    const product = store.add({ name: '  Basic Scooter  ', price: 1500, qty: 2 });

    expect(product).toMatchObject({ name: 'Basic Scooter', price: 1500, qty: 2 });
    expect(store.products).toHaveLength(1);
  });

  it('adds multiple products with unique IDs', () => {
    const store = new Store();

    store.add({ name: 'Basic Scooter', price: 1500, qty: 2 });
    store.add({ name: 'Electric Scooter', price: 2200, qty: 1 });

    expect(store.products).toHaveLength(2);
    expect(store.products[0].id).not.toBe(store.products[1].id);
  });

  it('allows different products with the same name', () => {
    const store = new Store();

    store.add({ name: 'Scooter', price: 1000, qty: 1 });
    store.add({ name: 'Scooter', price: 2000, qty: 2 });

    expect(store.products).toHaveLength(2);
    expect(store.total()).toBe(5000);
  });

  it('finds an existing product by name without case sensitivity', () => {
    const store = new Store([{ name: 'City Scooter', price: 1200, qty: 3 }]);

    expect(store.find('city scooter')).toMatchObject({ name: 'City Scooter' });
  });

  it('finds an existing product by ID', () => {
    const store = new Store();
    const product = store.add({ name: 'City Scooter', price: 1200, qty: 3 });

    expect(store.find(product.id)).toMatchObject({ name: 'City Scooter', qty: 3 });
  });

  it('returns null when a product is not found', () => {
    const store = new Store();

    expect(store.find('Missing Scooter')).toBeNull();
    expect(store.find(999)).toBeNull();
  });

  it('removes the first matching product by name', () => {
    const store = new Store([
      { name: 'Scooter', price: 1000, qty: 1 },
      { name: 'Scooter', price: 2000, qty: 2 },
    ]);

    expect(store.remove('scooter')).toBe(true);
    expect(store.products).toHaveLength(1);
    expect(store.products[0].price).toBe(2000);
  });

  it('removes a product by ID', () => {
    const store = new Store([{ name: 'Scooter', price: 1000, qty: 1 }]);
    const [product] = store.products;

    expect(store.remove(product.id)).toBe(true);
    expect(store.products).toEqual([]);
  });

  it('returns false when asked to remove a missing product', () => {
    const store = new Store();

    expect(store.remove('Missing Scooter')).toBe(false);
    expect(store.remove(999)).toBe(false);
  });

  it('returns zero total for an empty store', () => {
    expect(new Store().total()).toBe(0);
  });

  it('calculates the total for one product', () => {
    const store = new Store([{ name: 'Scooter', price: 1500, qty: 2 }]);

    expect(store.total()).toBe(3000);
  });

  it('calculates the combined total for multiple products', () => {
    const store = new Store([
      { name: 'Basic Scooter', price: 1500, qty: 2 },
      { name: 'Electric Scooter', price: 2200, qty: 3 },
    ]);

    expect(store.total()).toBe(9600);
  });

  it('keeps the total at zero for a product with quantity zero', () => {
    const store = new Store([{ name: 'Scooter', price: 1500, qty: 0 }]);

    expect(store.products).toHaveLength(1);
    expect(store.total()).toBe(0);
  });

  it('changes a product quantity and updates the total', () => {
    const store = new Store([{ name: 'Scooter', price: 1500, qty: 2 }]);
    const [product] = store.products;

    expect(store.changeQuantity(product.id, 1)).toBe(true);
    expect(store.find(product.id).qty).toBe(3);
    expect(store.total()).toBe(4500);

    expect(store.changeQuantity(product.id, -1)).toBe(true);
    expect(store.find(product.id).qty).toBe(2);
    expect(store.total()).toBe(3000);
  });

  it('does not allow quantity to become negative', () => {
    const store = new Store([{ name: 'Scooter', price: 1500, qty: 0 }]);
    const [product] = store.products;

    expect(store.changeQuantity(product.id, -1)).toBe(false);
    expect(store.find(product.id).qty).toBe(0);
  });

  it('rejects invalid quantity changes and missing product IDs', () => {
    const store = new Store([{ name: 'Scooter', price: 1500, qty: 2 }]);
    const [product] = store.products;

    expect(store.changeQuantity(product.id, Number.NaN)).toBe(false);
    expect(store.changeQuantity(999, 1)).toBe(false);
    expect(store.find(product.id).qty).toBe(2);
  });

  it('rejects non-object products', () => {
    const store = new Store();

    expect(() => store.add(null)).toThrow('Product must be an object');
    expect(() => store.add('Scooter')).toThrow('Product must be an object');
  });

  it('rejects an empty product name', () => {
    const store = new Store();

    expect(() => store.add({ name: '  ', price: 1000, qty: 1 })).toThrow('Name is required');
    expect(store.products).toEqual([]);
  });

  it('rejects invalid prices', () => {
    const store = new Store();

    expect(() => store.add({ name: 'Scooter', price: 0, qty: 1 })).toThrow(
      'Price must be greater than 0'
    );
    expect(() => store.add({ name: 'Scooter', price: 'not a price', qty: 1 })).toThrow(
      'Price must be greater than 0'
    );
    expect(store.products).toEqual([]);
  });

  it('rejects empty, non-numeric, and negative quantities', () => {
    const store = new Store();

    expect(() => store.add({ name: 'Scooter', price: 1000, qty: '' })).toThrow(
      'Quantity must be a number'
    );
    expect(() => store.add({ name: 'Scooter', price: 1000, qty: 'many' })).toThrow(
      'Quantity must be a number'
    );
    expect(() => store.add({ name: 'Scooter', price: 1000, qty: false })).toThrow(
      'Quantity must be a number'
    );
    expect(() => store.add({ name: 'Scooter', price: 1000, qty: -1 })).toThrow(
      'Quantity cannot be negative'
    );
    expect(store.products).toEqual([]);
  });

  it('returns copies so callers cannot mutate stored products directly', () => {
    const store = new Store([{ name: 'Scooter', price: 1000, qty: 2 }]);
    const product = store.find('Scooter');
    product.qty = 99;

    expect(store.find('Scooter').qty).toBe(2);
    expect(store.total()).toBe(2000);
  });
});
