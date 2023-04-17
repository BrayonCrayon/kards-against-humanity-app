import React, { FC, ReactNode, useCallback, useState } from "react";

export type Tab = { key: string; element: ReactNode };

export interface INavContainer {
  tabs: Tab[];
}

const TabView: FC<INavContainer> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(tabs.length ? tabs[0].key : "");

  const renderTab = useCallback(
    (tab: Tab) => {
      if (Boolean(tab.element) && tab.key !== selectedTab) return null;

      return tab.element instanceof Function ? tab.element() : tab.element;
    },
    [selectedTab]
  );

  return (
    <>
      <nav className="flex pb-1.5 mb-2 w-full h-8">
        <div className="flex w-full">
          {tabs.map((tab) => (
            <div
              key={`${tab.key}-tab`}
              data-testid={tab.key}
              className={`capitalize cursor-pointer flex-1 text-center ${
                tab.key === selectedTab ? "border-b-4 border-black pb-1" : "border-b-2"
              }`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.key}
            </div>
          ))}
        </div>
      </nav>
      {tabs.map((tab) => (
        <>{renderTab(tab)}</>
      ))}
    </>
  );
};

export default TabView;
