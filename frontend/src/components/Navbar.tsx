import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { toggleSidebar } from '../features/products/productsSlice';
import { AppDispatch, RootState } from '../app/store';

// We'll use this mock function for demonstration purposes
const mockSearchFunction = (term: string) => {
    console.log(`Searching for: ${term}`);
    // In a real scenario, this would trigger a dispatch to refetch products with the search term
    // e.g., dispatch(productsApi.endpoints.getProducts.initiate({ search: term, ...otherParams }));
};

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isSidebarOpen = useSelector((state: RootState) => state.products.isSidebarOpen);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      mockSearchFunction(searchTerm.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 lg:hidden"
            onClick={() => dispatch(toggleSidebar())}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="text-2xl font-extrabold text-primary-blue tracking-wide cursor-pointer">
            Nexus Catalog
          </div>
        </div>

        {/* Search Bar (Center/Flexible) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-lg mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue transition duration-150"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2 mr-2 p-1 text-gray-500 hover:text-primary-blue"
              aria-label="Submit Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Action Buttons (Cart, etc.) */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-700 hover:bg-gray-100 relative">
            <ShoppingCart className="h-6 w-6" />
            {/* Mock Cart Count */}
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
          </button>
          
          <div className="hidden sm:block text-sm font-medium text-gray-700">
            Hi, User!
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
