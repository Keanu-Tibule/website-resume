import React from 'react'
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <div className='py-4 bg-black justify-center text-center flex md:fixed top-0 w-full'>
      <nav>
        <ul className='flex flex-wrap justify-center space-x-6'>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/pages/about">About</Link>
          </li>
          <li>
            <Link href="/pages/projects">Projects</Link>
          </li>
          <li>
            <Link href="/pages/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
