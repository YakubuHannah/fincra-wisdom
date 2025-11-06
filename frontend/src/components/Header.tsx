<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo - Hidden text on mobile */}
      <div className="flex items-center space-x-3">
        <img 
          src="/images/Fincra_coloured_full_logo.png" 
          alt="Fincra" 
          className="h-8"
        />
        <h1 className="hidden sm:block text-xl font-bold text-gray-900">
          Fincra Wisdom
        </h1>
      </div>

      {/* Right side icons - Adjusted spacing */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Ask AI Button - Compact on mobile */}
        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Icons - Smaller on mobile */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <Bookmark className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            P
          </div>
        </button>
      </div>
    </div>
  </div>
</header>