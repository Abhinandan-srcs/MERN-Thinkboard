import React from 'react';
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon } from 'lucide-react';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>
            ThinkBoard
          </h1>

          {/* 👇 ADD THIS */}
          <div className='flex-1 max-w-sm relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40' />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 pr-4 py-2 rounded-xl bg-base-200 border border-base-content/10 text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary transition'
            />
          </div>

          <div className='flex items-center gap-4'>
            <Link to="/create" className='btn btn-primary'>
              <PlusIcon className='size-5' />
              <span>New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;