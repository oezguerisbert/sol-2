/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import React from 'react';
import { ThemeContext } from '~/context/theme';

const ColorModeToggle = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  function isDark() {
    return theme === 'dark';
  }
  const styling = { className: 'w-5 h-5' };
  return (
    <div
      className='cursor-pointer'
      onClick={() => {
        setTheme(!isDark() ? 'dark' : 'light');
      }}
    >
      {isDark() ? <SunIcon {...styling} /> : <MoonIcon {...styling} />}
    </div>
  );
};

export default ColorModeToggle;
