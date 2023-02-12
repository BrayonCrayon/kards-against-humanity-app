import React, { FC, ReactNode, useCallback, useState } from "react";

export type Tab = { key: string, element: ReactNode };

export interface INavContainer {
    tabs: Tab[]
}

const TabView: FC<INavContainer> = ({tabs}) => {

    const [selectedTab, setSelectedTab] = useState(tabs.length ? tabs[0].key : '');

    const renderTab = useCallback((tab: Tab) => {
        if (Boolean(tab.element) && tab.key !== selectedTab) return null;

        return tab.element instanceof Function ? tab.element() : tab.element;
    }, [selectedTab]);

    return <>
        <nav className="flex pb-1.5 mx-2 mb-4 border-b-2 w-full relative h-8">
            <div className="absolute top-0 flex gap-4">
                {
                    tabs.map(tab => (
                        <p
                            key={tab.key}
                            data-testid={tab.key}
                            className={
                                `capitalize cursor-pointer ${tab.key === selectedTab ? 'border-b-4 border-black pb-1' : ''}`
                            }
                            onClick={() => setSelectedTab(tab.key)}
                        >{tab.key}</p>
                    ))
                }
            </div>
        </nav>
            {
                tabs.map(tab =>
                    <div key={tab.key}>{ renderTab(tab) }</div>
                )
            }
    </>
}

export default TabView;
