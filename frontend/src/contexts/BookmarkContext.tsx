import React, { createContext, useContext, useState, useEffect } from 'react';
import bookmarkService, { BookmarkedDocument } from '../services/bookmarkService';

interface BookmarkContextType {
  bookmarks: BookmarkedDocument[];
  addBookmark: (doc: Omit<BookmarkedDocument, 'bookmarkedAt'>) => void;
  removeBookmark: (docId: string) => void;
  isBookmarked: (docId: string) => boolean;
  bookmarkCount: number;
  refreshBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedDocument[]>([]);

  const refreshBookmarks = () => {
    setBookmarks(bookmarkService.getBookmarks());
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const addBookmark = (doc: Omit<BookmarkedDocument, 'bookmarkedAt'>) => {
    bookmarkService.addBookmark(doc);
    refreshBookmarks();
  };

  const removeBookmark = (docId: string) => {
    bookmarkService.removeBookmark(docId);
    refreshBookmarks();
  };

  const isBookmarked = (docId: string) => {
    return bookmarkService.isBookmarked(docId);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        bookmarkCount: bookmarks.length,
        refreshBookmarks
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
};