import React from 'react';
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon, SunIcon, MoonIcon, LogInIcon, MenuIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = ({ searchQuery, setSearchQuery, theme, toggleTheme, onMenuClick, setActiveView }) => {
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between gap-4'>

          {/* Left: hamburger + brand */}
          <div className='flex items-center gap-3'>
            <button
              onClick={onMenuClick}
              className='btn btn-ghost btn-circle'
              aria-label="Open menu"
            >
              <MenuIcon className='size-5' />
            </button>
            <span
              onClick={() => setActiveView("all")}
              className='text-3xl font-bold text-primary font-mono tracking-tight cursor-pointer'
            >
              ThinkBoard
            </span>
          </div>

          {/* Center: search */}
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

          {/* Right: theme + auth */}
          <div className='flex items-center gap-4'>
            <button onClick={toggleTheme} className='btn btn-ghost btn-circle'>
              {theme === "dark" ? <SunIcon className='size-5' /> : <MoonIcon className='size-5' />}
            </button>

            <SignedIn>
              <Link to="/create" className='btn btn-primary'>
                <PlusIcon className='size-5' />
                <span className='hidden sm:inline'>New Note</span>
              </Link>
              <div className='ml-2 mt-1'>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className='btn btn-primary'>
                  <LogInIcon className='size-5' />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
