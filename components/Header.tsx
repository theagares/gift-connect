
import React from 'react';
import GiftIcon from './icons/GiftIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center text-center">
        <div className="flex items-center gap-3">
            <GiftIcon className="w-8 h-8 text-indigo-400" />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Gift Connect</h1>
                <p className="text-sm text-gray-400 mt-1">인간관계를 이어주는 스마트한 선물 도우미</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
