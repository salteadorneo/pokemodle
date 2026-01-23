import * as storage from '@/services/storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('setKey and getKey should store and retrieve a value', () => {
    storage.setKey('test', { foo: 'bar' });
    const result = storage.getKey('test');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('removeKey should remove a value', () => {
    storage.setKey('test', 123);
    storage.removeKey('test');
    const result = storage.getKey('test');
    expect(result).toBeNull();
  });
});
