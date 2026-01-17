"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PostPage({ params }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const postId = resolvedParams?.id;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPost(data.post);
      } else {
        console.error('Failed to fetch post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0">
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-black/30 z-10" />
        <div className="relative z-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          <p className="mt-4 text-white text-xl font-semibold">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0">
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-black/30 z-10" />
        <div className="relative z-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/40 z-10" />
      
      <div className="relative z-20">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>

          {/* Post Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 mt-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{post.author.name}</p>
                  <p className="text-sm text-white/80">{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Published by <span className="font-semibold text-gray-800">{post.author.name}</span></p>
                  <p>@{post.author.username || post.author.email}</p>
                </div>
                <div className="flex gap-3">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </main>
      </div>
    </div>
  );
}
