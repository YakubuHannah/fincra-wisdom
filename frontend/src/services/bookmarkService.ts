// Local storage bookmark service (until we have authentication)

export interface BookmarkedDocument {
  _id: string;
  title: string;
  category: string;
  departmentName: string;
  departmentSlug: string;
  fileType: string;
  createdAt: string;
  bookmarkedAt: string;
}

const BOOKMARKS_KEY = 'fincra_wisdom_bookmarks';

const bookmarkService = {
  // Get all bookmarks
  getBookmarks(): BookmarkedDocument[] {
    try {
      const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error reading bookmarks:', error);
      return [];
    }
  },

  // Add bookmark
  addBookmark(document: Omit<BookmarkedDocument, 'bookmarkedAt'>): void {
    try {
      const bookmarks = this.getBookmarks();
      
      // Check if already bookmarked
      if (bookmarks.some(b => b._id === document._id)) {
        return;
      }

      const newBookmark: BookmarkedDocument = {
        ...document,
        bookmarkedAt: new Date().toISOString()
      };

      bookmarks.unshift(newBookmark); // Add to beginning
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  // Remove bookmark
  removeBookmark(documentId: string): void {
    try {
      const bookmarks = this.getBookmarks();
      const filtered = bookmarks.filter(b => b._id !== documentId);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  // Check if bookmarked
  isBookmarked(documentId: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b._id === documentId);
  },

  // Get bookmark count
  getCount(): number {
    return this.getBookmarks().length;
  },

  // Clear all bookmarks
  clearAll(): void {
    localStorage.removeItem(BOOKMARKS_KEY);
  }
};

export default bookmarkService;