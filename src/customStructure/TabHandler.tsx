import { Tab, parseTabList, stringifyTabList } from './TabStructure';
import Cookies from 'js-cookie';

export function getFromLocal(): Tab[] {
  console.log('getting cookie data');
  if (Cookies.get('TabList')) {
    console.log('cookie found:\n' + Cookies.get('TabList'));
    return parseTabList(Cookies.get('TabList'));
  } else {
    console.log('no cookie');
    return [];
  }
}
export function setAsLocal(tabList: Tab[]): void {
  Cookies.set('TabList', stringifyTabList(tabList));
}

export async function adjustVolume(id: number, newVolume: number) {
  const a = newVolume / 200;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: id },
      func: ({ a }) => {
        const mediaElements: HTMLMediaElement[] = Array.from(document.querySelectorAll('video, audio'));
        mediaElements.forEach(media => {
          media.volume = a;
        });
      },
      args: [{ a }],
    });
  } catch (error) {
    console.error('Error executing script:', error);
  }
}

export function updateLocalVolume(id: number, newVolume: number): Tab[] {
  const localList: Tab[] = parseTabList(Cookies.get('TabList'));
  const updatedList: Tab[] = localList.map(tab => {
    if (tab.id == id) {
      console.log('tab found, volume changing');
      return { ...tab, volume: newVolume };
    }
    return tab;
  });
  Cookies.set('TabList', stringifyTabList(updatedList));
  console.log(JSON.stringify(updatedList));
  return updatedList;
}
export function sortByIndex(a: Tab, b: Tab): number {
  return a.index - b.index;
}

export function objectExistsInList(list: Tab[], attributeValue: number): boolean {
  return list.some(obj => obj.id === attributeValue);
}
export function combineWithCookie(cookieList: Tab[], queryList: Tab[]) {
  const result = [];
  for (const obj of queryList) {
    if (!objectExistsInList(cookieList, obj.id)) {
      result.push(obj);
    } else {
      const a = cookieList.find(a => a.id == obj.id);

      result.push({ id: obj.id, name: obj.name, index: obj.index, volume: a.volume });
    }
  }
  return result;
}
