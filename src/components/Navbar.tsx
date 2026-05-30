import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react'
;
import AppSettings from './AppSettings';
import DataActions from './DataActions';

import type { Transaction } from '../types';

interface NavbarProps {
  items: Transaction[];
  onImport: (items: Transaction[]) => void;
}

export default function Navbar({ items, onImport }: NavbarProps) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<'settings' | 'data' | 'mobile' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu: 'settings' | 'data' | 'mobile') => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-40 w-full bg-surface-card backdrop-blur-md border-b border border-hairline-strong">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-heading-sm:text-heading-md font-[500] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-orange">
            📊 {t('app_title')}
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('settings')}
              className={`capitalize flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-[500] transition-colors ${
                openDropdown === 'settings' 
                  ? 'bg-surface-elevated text-accent-blue  ' 
                  : 'text-charcoal  hover:bg-surface-elevated '
              }`}
            >
              ⚙️ {t('settings') || 'Settings'} ▾
            </button>
            {openDropdown === 'settings' && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-card border border-hairline-strong rounded-lg p-4 z-50">
                <AppSettings isVertical />
              </div>
            )}
          </div>

          {/* Data Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('data')}
              className={`capitalize flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-[500] transition-colors ${
                openDropdown === 'data' 
                  ? 'bg-surface-elevated text-accent-blue  ' 
                  : 'text-charcoal  hover:bg-surface-elevated '
              }`}
            >
              📥 {t('data') || 'Data'} ▾
            </button>
            {openDropdown === 'data' && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-card border border-hairline-strong rounded-lg p-4 z-50">
                <DataActions items={items} onImport={onImport} isVertical />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-mute hover:bg-surface-elevated rounded-lg transition-colors"
          onClick={() => toggleDropdown('mobile')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24">
            {openDropdown === 'mobile' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {openDropdown === 'mobile' && (
        <div className="md:hidden border-t border border-hairline-strong bg-surface-card p-4 space-y-6 max-h-[80vh] overflow-y-auto absolute w-full z-50">
          <div className="space-y-3">
            <p className="capitalize text-caption font-[500] text-ash tracking-wider">⚙️ {t('settings') || 'Settings'}</p>
            <AppSettings isVertical />
          </div>
          <div className="h-px w-full bg-surface-card"></div>
          <div className="space-y-3">
            <p className="capitalize text-caption font-[500] text-ash tracking-wider">📥 {t('data') || 'Data'}</p>
            <DataActions items={items} onImport={onImport} isVertical />
          </div>
        </div>
      )}
    </nav>
  );
}
