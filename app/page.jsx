"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPosts, setCurrentPage, setSelectedCategory } from "@/lib/redux/slices/postsSlice";
import { setSearchTerm } from "@/lib/redux/slices/uiSlice";

export default function Home() {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const { posts: blogPosts, loading, pagination, currentPage, selectedCategory } = useSelector((state) => state.posts);
  const { searchTerm } = useSelector((state) => state.ui);

  const postsPerPage = 12;

  // Fetch published posts with memoization
  const fetchPostsData = useCallback(() => {
    dispatch(fetchPosts({ 
      category: selectedCategory, 
      page: currentPage, 
      limit: postsPerPage 
    }));
  }, [dispatch, selectedCategory, currentPage, postsPerPage]);

  useEffect(() => {
    fetchPostsData();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPostsData]);

  // Categories that actually exist in the app - memoized
  const categories = useMemo(() => [
    "all",
    "tech",
    "fashion",
    "designing",
    "medical",
    "law",
    "sports",
    "education",
    "food",
    "travel",
    "finance"
  ], []);

  // Filter posts safely with useMemo
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      const q = searchTerm.toLowerCase();

      return title.includes(q) || content.includes(q) || q === "";
    });
  }, [blogPosts, searchTerm]);

  // Helper to strip HTML and truncate text - memoized
  const stripHtmlAndTruncate = useCallback((html, maxLength = 150) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }, []);

  // Helper to format date - memoized
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }, []);

  // Helper to get category emoji - memoized
  const getCategoryEmoji = useCallback((category) => {
    const emojiMap = {
      tech: '💻',
      fashion: '👗',
      designing: '🎨',
      medical: '⚕️',
      law: '⚖️',
      sports: '⚽',
      education: '📚',
      food: '🍽️',
      travel: '✈️',
      finance: '💰'
    };
    return emojiMap[category] || '📝';
  }, []);

  // Handlers with useCallback
  const handleSearchChange = useCallback((e) => {
    dispatch(setSearchTerm(e.target.value));
  }, [dispatch]);

  const handleCategoryChange = useCallback((e) => {
    dispatch(setSelectedCategory(e.target.value));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  return (
    <div className="min-h-screen relative">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
        
      </video>

      {/* Dim overlay so content reads on top of the video */}
      <div className="fixed inset-0 bg-black/30 z-10" />

      <div className="relative z-20">
       

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Search & Filter */}
          <motion.div 
            className="mb-8 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl mx-4 border border-white/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Title */}
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover Amazing Stories
            </motion.h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <motion.div 
                className="flex-1 relative group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search your next inspiration..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                  />
                </div>
              </motion.div>
              
              {/* Category Filter */}
              <motion.div 
                className="md:w-72 relative group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none">
                    🏷️
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full pl-12 pr-10 py-3.5 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 capitalize bg-white/80 backdrop-blur-sm text-gray-700 font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer"
                    style={{
                      backgroundImage: 'none'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="capitalize bg-white py-2 rounded-xl">
                        {cat === 'all' ? 'All Categories' : `${getCategoryEmoji(cat)} ${cat}`}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
                    ▼
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Search Info */}
            <AnimatePresence>
              {searchTerm && (
                <motion.p 
                  className="mt-4 text-center text-sm text-purple-600 font-medium"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  🎯 Searching for: <span className="font-bold">&ldquo;{searchTerm}&rdquo;</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hero with animation */}
          <motion.section
            id="home"
            className="section text-center mb-12 bg-transparent  rounded-lg p-8 mx-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg rainbow-text">
                {[
                  'B','l','o','g','g','e','r',' ','B','a','b','a'
                ].map((ch, i) => (
                  <span key={i}>{ch}</span>
                ))}
              </h1>
            <div className="flex justify-center my-6">
              <div className="bg-black rounded-full px-8 py-6 flex items-center justify-center shadow-lg">
                <p className="text-xl rainbow-text text-center">
                  {"Ready to share insights in your domain.".split("").map((ch, i) => (
                    <span key={i}>{ch}</span>
                  ))}
                </p>
              </div>
            </div>
          </motion.section>

          

          {/* Posts Grid */}
          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
              <p className="mt-4 text-white text-lg font-semibold">Loading posts...</p>
            </motion.div>
          ) : (
            <>
              {/* Posts Grid */}
              {filteredPosts.length > 0 && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/post/${post.id}`}>
                        <div className="p-6">
                          {/* Category Badge */}
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full uppercase">
                              {post.category}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h2 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2 hover:text-purple-600 transition-colors">
                            {post.title}
                          </h2>
                          
                          {/* Excerpt */}
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {stripHtmlAndTruncate(post.content)}
                          </p>
                          
                          {/* Author & Date */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {post.author.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(post.createdAt)}
                                </p>
                              </div>
                            </div>
                            
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </>
          )}
          
          {/* Pagination Controls */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-3 mt-8 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPrev}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  pagination.hasPrev
                    ? 'bg-white/90 hover:bg-white text-purple-600 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first 2, last 2, and pages around current
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === pagination.totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  
                  const showEllipsis = 
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2);

                  if (showEllipsis) {
                    return <span key={pageNum} className="px-2 text-white">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                          : 'bg-white/90 hover:bg-white text-purple-600 hover:shadow-lg'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={!pagination.hasNext}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  pagination.hasNext
                    ? 'bg-white/90 hover:bg-white text-purple-600 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </motion.div>
          )}

          {/* Page Info */}
          {!loading && pagination && (
            <motion.div 
              className="text-center mt-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-white text-sm bg-black/30 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
                Showing {blogPosts.length > 0 ? ((currentPage - 1) * postsPerPage + 1) : 0} - {Math.min(currentPage * postsPerPage, pagination.totalCount)} of {pagination.totalCount} posts
              </p>
            </motion.div>
          )}
          
          {/* No Posts Message */}
          <AnimatePresence>
            {!loading && filteredPosts.length === 0 && (
              <motion.div
                className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg mx-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-gray-700 text-lg mb-2 font-semibold">No blog posts available yet.</p>
                <p className="text-gray-600 text-sm mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search or filter.' 
                    : selectedCategory === 'all'
                    ? 'Be the first to share your thoughts!'
                    : `No posts in ${selectedCategory} category yet.`
                  }
                </p>
                <Link 
                  href={selectedCategory === 'all' ? '/tech' : `/${selectedCategory}`}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {selectedCategory === 'all' 
                    ? 'Write First Post ✍️' 
                    : `Write ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Post ✍️`
                  }
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

   
      </div>
    </div>
  );
}

