import { useState } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { RootState } from './app/store';
import { useSelector } from 'react-redux';
import FilterSidebar from './components/FilterSidebar';


function App() {
  // Simple state for "routing" as we only have the Home page and don't use React Router.
  const [currentPage, setCurrentPage] = useState<'home' | 'productDetail'>('home');
  // Simple check for the sidebar state from Redux
  const isSidebarOpen = useSelector((state: RootState) => state.products.isSidebarOpen);

  // FIX FOR TS2741: Define the required prop function here.
  // The 'filters' parameter type should match what FilterSidebar returns (likely an object)
  const handleApplyFilters = (filters: any) => {
    // In a real application, this function would dispatch an action 
    // to Redux or trigger a data fetch based on the applied filters.
    console.log("Filters applied:", filters);
  };


  // In a simple app, we only render the Home component for the catalog view.
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'productDetail':
        // Placeholder for a future Product Detail component
        return (
          <div className="p-8 text-center text-gray-500">
            Product Detail View - Implement later.
            <button 
              onClick={() => setCurrentPage('home')} 
              className="mt-4 text-primary-blue hover:underline"
            >
              Go Back to Catalog
            </button>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Navigation Bar */}
      <Navbar />

      <main className="flex flex-1 relative pt-16">
        
        {/* 2. Filter Sidebar (Hidden on mobile by default) */}
        {/* The onApplyFilters prop is now correctly passed, fixing TS2741 */}
        <FilterSidebar 
          isSidebarOpen={isSidebarOpen} 
          onApplyFilters={handleApplyFilters}
        />
        
        {/* 3. Main Content Area */}
        <div className="flex-1 transition-all duration-300">
          {renderPage()}
        </div>
      </main>
      
      {/* Optional: Add a simple footer */}
      <footer className="w-full p-4 bg-gray-800 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} ALX Project Nexus. Built with React & Django.
      </footer>
    </div>
  );
}

export default App;
