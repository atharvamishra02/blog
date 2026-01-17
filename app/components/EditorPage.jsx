"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), { ssr: false });

export default function EditorPage({ 
  title = "Editor", 
  backgroundImage = "/bg.mp4", 
  category = "general",
  placeholder = "Write your post here..." 
}) {
  const [editorData, setEditorData] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [ClassicEditor, setClassicEditor] = useState(null);
  const [savedStatus, setSavedStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    setEditorLoaded(true);
    import('@ckeditor/ckeditor5-build-classic').then(mod => {
      setClassicEditor(() => mod.default);
    });
    
    // Load saved draft if exists
    const saved = localStorage.getItem(`${category}-draft`);
    if (saved) {
      setEditorData(saved);
    }

    // Add custom CSS for heading dropdown AND editor content
    const style = document.createElement('style');
    style.innerHTML = `
      /* Style the heading dropdown options - COMMON SIZE for easy reading */
      .ck.ck-button.ck-heading_paragraph .ck-button__label {
        font-size: 14px !important;
        font-weight: 400 !important;
      }
      .ck.ck-button.ck-heading_heading1 .ck-button__label {
        font-size: 14px !important;
        font-weight: 700 !important;
        color: #7c3aed !important;
      }
      .ck.ck-button.ck-heading_heading2 .ck-button__label {
        font-size: 14px !important;
        font-weight: 700 !important;
        color: #8b5cf6 !important;
      }
      .ck.ck-button.ck-heading_heading3 .ck-button__label {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #a78bfa !important;
      }
      .ck.ck-button.ck-heading_heading4 .ck-button__label {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #c4b5fd !important;
      }
      .ck.ck-button.ck-heading_heading5 .ck-button__label {
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #ddd6fe !important;
      }
      /* Add padding to dropdown items for better spacing */
      .ck.ck-list__item .ck-button {
        padding: 8px 12px !important;
      }

      /* Style the ACTUAL headings in the editor content */
      .ck-content h1 {
        font-size: 2.5em !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        margin: 0.67em 0 !important;
        color: #1f2937 !important;
      }
      .ck-content h2 {
        font-size: 2em !important;
        font-weight: 700 !important;
        line-height: 1.3 !important;
        margin: 0.75em 0 !important;
        color: #374151 !important;
      }
      .ck-content h3 {
        font-size: 1.75em !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        margin: 0.83em 0 !important;
        color: #4b5563 !important;
      }
      .ck-content h4 {
        font-size: 1.5em !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        margin: 1em 0 !important;
        color: #6b7280 !important;
      }
      .ck-content h5 {
        font-size: 1.25em !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        margin: 1.5em 0 !important;
        color: #6b7280 !important;
      }
      .ck-content p {
        font-size: 1em !important;
        line-height: 1.6 !important;
        margin: 1em 0 !important;
      }

      /* Style BULLETED lists (• dots) */
      .ck-content ul {
        list-style-type: disc !important;
        padding-left: 40px !important;
        margin: 1em 0 !important;
      }
      .ck-content ul li {
        display: list-item !important;
        list-style-type: disc !important;
        margin: 0.5em 0 !important;
      }

      /* Style NUMBERED lists (1, 2, 3) */
      .ck-content ol {
        list-style-type: decimal !important;
        padding-left: 40px !important;
        margin: 1em 0 !important;
      }
      .ck-content ol li {
        display: list-item !important;
        list-style-type: decimal !important;
        margin: 0.5em 0 !important;
      }

      /* Nested lists */
      .ck-content ul ul {
        list-style-type: circle !important;
      }
      .ck-content ul ul ul {
        list-style-type: square !important;
      }
      .ck-content ol ol {
        list-style-type: lower-alpha !important;
      }
      .ck-content ol ol ol {
        list-style-type: lower-roman !important;
      }

      /* Style blockquote */
      .ck-content blockquote {
        border-left: 4px solid #a78bfa !important;
        padding-left: 20px !important;
        margin: 1.5em 0 !important;
        font-style: italic !important;
        color: #6b7280 !important;
        background: #f9fafb !important;
        padding: 15px 20px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [category]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!editorData) return;
    
    const timer = setInterval(() => {
      localStorage.setItem(`${category}-draft`, editorData);
      setSavedStatus("Draft saved ✓");
      setTimeout(() => setSavedStatus(""), 2000);
    }, 30000);

    return () => clearInterval(timer);
  }, [editorData, category]);

  const handleProceed = async () => {
    if (!editorData.trim()) {
      alert('Please write some content before proceeding!');
      return;
    }

    // Check if user is logged in
    try {
      const authResponse = await fetch('/api/auth/verify');
      const authData = await authResponse.json();
      
      if (!authResponse.ok || !authData.user) {
        alert('⚠️ You must be logged in to publish a post!\n\nPlease sign in or sign up first.');
        router.push('/login');
        return;
      }
    } catch (authError) {
      console.error('Auth check error:', authError);
      alert('⚠️ Please log in to publish your post!');
      router.push('/login');
      return;
    }
    
    try {
      // Extract title from content
      const title = extractTitle(editorData);
      
      // Send to API
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: editorData,
          category,
          published: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish post');
      }

      // Clear draft
      localStorage.removeItem(`${category}-draft`);
      
      alert('Post published successfully! 🎉');
      router.push('/');
    } catch (error) {
      console.error('Publish error:', error);
      alert(error.message || 'Failed to publish post. Please try again.');
    }
  };

  const extractTitle = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const h1 = temp.querySelector('h1, h2, h3');
    return h1 ? h1.textContent.substring(0, 100) : 'Untitled Post';
  };

  // Custom upload adapter for images
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ default: reader.result });
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsDataURL(file);
          });
        });
      }
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="min-h-screen w-full p-0 m-0 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('${backgroundImage}')`}}></div>
      <div className="fixed inset-0 z-10 "></div>
      
      {/* Animated Floating Orbs */}
      <motion.div
        className="fixed top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-1/2 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-20 flex flex-col h-screen">
        {/* Title with Gradient & Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 pb-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-center bg-white bg-clip-text text-transparent drop-shadow-2xl mb-2">
            {title}
          </h1>
          <p className="text-center text-white/70 text-sm md:text-base font-light">
            ✨ Create something amazing ✨
          </p>
        </motion.div>
        
        <div className="flex-1 flex flex-col px-4 md:px-8 pb-24 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full">
            {editorLoaded && ClassicEditor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20 relative"
              >
                {/* Decorative Top Bar */}
                <div className="h-2 "></div>
                
                {/* Editor Header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{category} Post</span>
                  </div>
                  {savedStatus && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-green-600 font-medium"
                    >
                      {savedStatus}
                    </motion.span>
                  )}
                </div>
                
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  onChange={(event, editor) => {
                    setEditorData(editor.getData());
                  }}
                  config={{
                    placeholder,
                    extraPlugins: [uploadPlugin],
                    toolbar: {
                      items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'undo',
                        'redo'
                      ],
                      shouldNotGroupWhenFull: true
                    },
                    heading: {
                      options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' }
                      ]
                    },
                    image: {
                      toolbar: [
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                      ]
                    },
                    table: {
                      contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableProperties',
                        'tableCellProperties'
                      ]
                    }
                  }}
                />
                
                {/* Decorative Bottom Bar with Stats */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-6">
                      <span className="text-gray-600">
                        📝 <span className="font-semibold text-purple-600">
                          {editorData.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
                        </span> words
                      </span>
                      <span className="text-gray-600">
                        📊 <span className="font-semibold text-blue-600">
                          {editorData.replace(/<[^>]*>/g, '').length}
                        </span> characters
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      Auto-saving every 30s
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {!editorLoaded && (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Proceed Button - Fixed at bottom with Gradient & Animation */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-pink-900/95 backdrop-blur-xl p-4 md:p-6 border-t-2 border-white/20 shadow-2xl"
        >
          <div className="max-w-5xl mx-auto flex justify-center gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all shadow-lg backdrop-blur-sm border border-white/10 text-sm md:text-base"
            >
              ← Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-xl text-sm md:text-base relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Publish Post</span>
                <span className="text-xl"></span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
