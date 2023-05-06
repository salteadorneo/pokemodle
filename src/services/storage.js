export function getKey(key) {
    return JSON.parse(localStorage.getItem(key))
}

export function setKey(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key) {
    localStorage.removeItem(key)
}