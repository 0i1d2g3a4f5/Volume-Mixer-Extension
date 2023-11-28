import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useState, useEffect } from 'react';
import { Tab } from '@root/src/customStructure/TabStructure';
import {
  getFromLocal,
  setAsLocal,
  adjustVolume,
  updateLocalVolume,
  sortByIndex,
  combineWithCookie,
} from '@root/src/customStructure/TabHandler';

const Popup = () => {
  const [tabList, setTabList] = useState<Tab[]>([]);

  function query() {
    let final = [];
    chrome.tabs.query({}, result => {
      const querried: Tab[] = result.map(tab => ({
        id: tab.id as number,
        name: tab.title as string,
        index: tab.index as number,
        volume: 100 as number,
      }));
      final = combineWithCookie(getFromLocal(), querried);
      setTabList(final);
      setAsLocal(final);
    });
    return final;
  }

  useEffect(() => {
    console.log('queryy');
    setTabList(query());
    console.log('TabList:\n' + JSON.stringify(tabList));
  }, []);

  const sortedTabs = tabList.slice().sort(sortByIndex);

  const handleSliderChange = (tab: Tab, newVolume: number) => {
    adjustVolume(tab.id, newVolume);
    setTabList(updateLocalVolume(tab.id, newVolume));
  };
  const handleClick = () => {
    setAsLocal([]);
    setTabList(query());
    tabList.forEach(tab => {
      adjustVolume(tab.id, 100);
    });
  };
  return (
    <div>
      <h2>Tab List</h2>
      <ul>
        {sortedTabs.map(tab => (
          <li key={tab.id}>
            <span>{tab.name.slice(0, 15)}</span>
            <input
              type="range"
              min={0}
              max={200}
              value={tab.volume}
              onChange={e => handleSliderChange(tab, +e.target.value)}
            />
            <span>{tab.volume}</span>
          </li>
        ))}
      </ul>
      <button id="myButton" onClick={handleClick}>
        Reset
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
