import { Home, BookOpen, Mail, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'home' | 'verses' | 'prayer' | 'social';

interface IOSTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function IOSTabBar({ activeTab, onTabChange }: IOSTabBarProps) {
  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'verses' as Tab, label: 'Scripture', icon: BookOpen },
    { id: 'prayer' as Tab, label: 'Prayer', icon: Mail },
    { id: 'social' as Tab, label: 'Social', icon: Smartphone },
  ];

  return (
    <div className="ios-tab-bar">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'ios-tab-item flex-1',
                isActive ? 'ios-tab-item-active' : 'ios-tab-item-inactive'
              )}
            >
              <Icon className={cn('w-6 h-6 mb-1', isActive && 'scale-110')} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
