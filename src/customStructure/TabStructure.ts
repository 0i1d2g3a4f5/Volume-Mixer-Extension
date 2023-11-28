export interface Tab {
  name: string;
  id: number;
  index: number;
  volume: number;
}

function isTab(obj: unknown): boolean {
  const a: Tab = { name: '', id: 0, index: 0, volume: 0 };
  return typeof obj === typeof a;
}

export const setTabVolume = (tab: Tab, newVolume: number): Tab => {
  const updatedTab: Tab = {
    ...tab,
    volume: newVolume,
  };

  return updatedTab;
};
export const setTabVolumeInList = (tab: Tab, tabList: Tab[], newVolume: number): Tab[] => {
  const updatedList: Tab[] = tabList.filter(t => t.id === tab.id && t.volume == newVolume);
  return updatedList;
};

export const removeTabfromList = (tab: Tab, tabList: Tab[]): Tab[] => {
  const updatedList: Tab[] = tabList.filter(t => t.id !== tab.id);
  return updatedList;
};

export const addTabToList = (tab: Tab, tabList: Tab[]): Tab[] => {
  const updatedList: Tab[] = [...tabList, tab];
  return updatedList;
};

export function parseTabList(jsonString: string): Tab[] | null {
  try {
    const parsedJson = JSON.parse(jsonString);

    if (Array.isArray(parsedJson)) {
      const isValid = parsedJson.every((tab: unknown) => isTab(tab));

      if (isValid) {
        return parsedJson as Tab[];
      } else {
        console.error('Invalid Tab format in the JSON');
      }
    } else {
      console.error('Invalid JSON format. Expected an array.');
    }
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
  }

  return null;
}

export function stringifyTabList(tabList: Tab[]): string {
  try {
    const jsonString = JSON.stringify(tabList);

    return jsonString;
  } catch (error) {
    console.error('Error stringifying TabList to JSON:', error.message);
    return '';
  }
}
