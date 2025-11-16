import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Photo, View, BlogPost, Comment, SortOption, NewBlogPostData } from './types';
import Header from './components/Header';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import BlogPostPage from './components/BlogPostPage';
import { blogPostsData, photosData } from './data/blogPosts';
import { commentsData } from './data/comments';
import StarryBackground from './components/StarryBackground';
import CosmosChatbot from './components/CosmosChatbot';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useLocale } from './contexts/LocaleContext';
import LoadingSpinner from './components/LoadingSpinner';
import { PHOTOS_PER_PAGE } from './constants';
import ToastContainer from './components/Toast';

// Lazy load components that are not always visible on initial load
const GalleryPage = lazy(() => import('./components/GalleryPage'));
const PhotoDetailModal = lazy(() => import('./components/PhotoDetailModal'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const AddPostModal = lazy(() => import('./components/AddPostModal'));
const StargazingPage = lazy(() => import('./components/StargazingPage'));

const PageLoader: React.FC = () => (
    <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
    </div>
);

const App: React.FC = () => {
  const { locale, t } = useLocale();
  const [currentView, setCurrentView] = useState<View>(View.GALLERY);
  
  // Locale-specific state
  const [photos, setPhotos] = useState<Photo[]>(photosData[locale]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(blogPostsData[locale]);
  const [comments, setComments] = useState<Comment[]>(commentsData[locale]);

  // General state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NEWEST);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const [ratingFilter, setRatingFilter] = useState(0);
  const [photoOfTheWeekId, setPhotoOfTheWeekId] = useState<string | null>('4');
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Update data when locale changes
  useEffect(() => {
    setPhotos(photosData[locale]);
    setBlogPosts(blogPostsData[locale]);
    setComments(commentsData[locale]);
    // Selections are reset, but filters (search, tags, rating) are now persistent.
    setSelectedPhoto(null);
    setSelectedPost(null);
  }, [locale]);
  
  // Reset to first page when filters or sorting change
  useEffect(() => {
      setCurrentPage(1);
  }, [activeTags, searchQuery, ratingFilter, sortOption, locale]);

  useEffect(() => {
    const tags = new Set<string>();
    photos.forEach(p => {
      p.tags?.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags).sort());
  }, [photos]);
  
  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedPost]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = selectedPhoto || isLoginModalOpen || isAddPostModalOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhoto, isLoginModalOpen, isAddPostModalOpen]);

  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(p => (p.id === photoId ? { ...p, ...updates } : p))
    );
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(prev => prev ? { ...prev, ...updates } : null);
    }
  };
  
  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    setSelectedPhoto(null);
  };

  const handleAddPhoto = (newPhoto: Photo) => {
    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
  };
  
  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView(View.BLOG_POST);
  };

  // Helper function to create a URL-friendly slug from a title
  const createSlug = (title: string): string => {
      return title
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
  };

  const handleAddPost = (postData: NewBlogPostData) => {
      let slug = createSlug(postData.title);
      const existingSlugs = new Set(blogPosts.map(p => p.slug));
      // Ensure slug is unique
      if (existingSlugs.has(slug)) {
          slug = `${slug}-${Date.now()}`;
      }

      const newPost: BlogPost = {
          ...postData,
          slug: slug,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      };
      setBlogPosts(prevPosts => [newPost, ...prevPosts]);
      setIsAddPostModalOpen(false);
  };

  const handleUpdatePost = (updatedPost: BlogPost) => {
    setBlogPosts(prevPosts =>
      prevPosts.map(p => (p.slug === updatedPost.slug ? updatedPost : p))
    );
    if (selectedPost?.slug === updatedPost.slug) {
      setSelectedPost(updatedPost);
    }
  };
  
  const handleAddComment = (postId: string, newCommentData: { author: string; email: string; content: string; parentId?: string }) => {
    const newComment: Comment = {
      id: new Date().toISOString(),
      postId,
      ...newCommentData,
      date: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleTagSelection = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const photoOfTheWeek = photos.find(p => p.id === photoOfTheWeekId);

  const sortedAndFilteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const tagMatch = activeTags.length > 0 ? activeTags.every(t => photo.tags?.includes(t)) : true;
      
      const query = searchQuery.toLowerCase();
      const searchMatch = searchQuery
        ? photo.title.toLowerCase().includes(query) ||
          photo.tags?.some(tag => tag.toLowerCase().includes(query))
        : true;
      
      const ratingMatch = ratingFilter > 0 ? (photo.rating || 0) >= ratingFilter : true;
        
      return tagMatch && searchMatch && ratingMatch;
    }).sort((a, b) => {
      switch (sortOption) {
        case SortOption.OLDEST:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case SortOption.RATING:
          return (b.rating || 0) - (a.rating || 0);
        case SortOption.TITLE:
          return a.title.localeCompare(b.title);
        case SortOption.NEWEST:
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [photos, activeTags, searchQuery, ratingFilter, sortOption]);
  
  const renderContent = () => {
    switch (currentView) {
        case View.GALLERY: {
            const totalPhotos = sortedAndFilteredPhotos.length;
            const totalPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);
            const paginatedPhotos = sortedAndFilteredPhotos.slice(
                (currentPage - 1) * PHOTOS_PER_PAGE,
                currentPage * PHOTOS_PER_PAGE
            );

            return (
              <Suspense fallback={<PageLoader />}>
                <GalleryPage
                  paginatedPhotos={paginatedPhotos}
                  onSelectPhoto={setSelectedPhoto}
                  onAddPhoto={handleAddPhoto}
                  isAdmin={isAdmin}
                  photoOfTheWeek={photoOfTheWeek}
                  searchQuery={searchQuery}
                  onQueryChange={setSearchQuery}
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                  allTags={allTags}
                  activeTags={activeTags}
                  onSelectTag={handleTagSelection}
                  onClearTags={() => setActiveTags([])}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Suspense>
            );
        }
        case View.BLOG:
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <BlogSection 
                        posts={blogPosts} 
                        onSelectPost={handleSelectPost}
                        isAdmin={isAdmin}
                        onAddPostClick={() => setIsAddPostModalOpen(true)} 
                    />
                </div>
            );
        case View.BLOG_POST:
            if (selectedPost) {
                return <BlogPostPage 
                            post={selectedPost} 
                            allComments={comments}
                            allPosts={blogPosts}
                            onAddComment={(newCommentData) => handleAddComment(selectedPost.slug, newCommentData)}
                            onBack={() => setCurrentView(View.BLOG)}
                            onUpdatePost={handleUpdatePost}
                            onSelectPost={handleSelectPost}
                            isAdmin={isAdmin}
                        />;
            }
            // Fallback if no post is selected
            setCurrentView(View.BLOG);
            return null;
        case View.STARGAZING:
            return (
                <Suspense fallback={<PageLoader />}>
                    <StargazingPage />
                </Suspense>
            );
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      
      <main className="flex-grow">
        <div key={`${currentView}-${locale}`} className="animate-view-change">
          {renderContent()}
        </div>
      </main>

      <Footer />
      <CosmosChatbot />
      {(currentView === View.GALLERY || currentView === View.BLOG || currentView === View.STARGAZING) && <ScrollToTopButton />}
      <ToastContainer />


      <Suspense fallback={<div />}>
        {selectedPhoto && (
          <PhotoDetailModal
            photo={selectedPhoto}
            allPhotos={sortedAndFilteredPhotos}
            onClose={() => setSelectedPhoto(null)}
            onUpdatePhoto={handleUpdatePhoto}
            onDeletePhoto={handleDeletePhoto}
            onNavigate={(nextPhoto) => setSelectedPhoto(nextPhoto)}
            isAdmin={isAdmin}
            onSetPhotoOfTheWeek={setPhotoOfTheWeekId}
          />
        )}

        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        
        {isAddPostModalOpen && (
          <AddPostModal 
              onClose={() => setIsAddPostModalOpen(false)}
              onAddPost={handleAddPost}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;