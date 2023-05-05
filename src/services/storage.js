import { Preferences } from '@capacitor/preferences';

export async function setKey (key, value) {
    await Preferences.set({
        key,
        value: JSON.stringify(value),
    });
}

export async function getKey (key) {
    const { value } = await Preferences.get({ key });
    return JSON.parse(value)
}

export async function removeKey (key) {
    await Preferences.remove({ key });
}