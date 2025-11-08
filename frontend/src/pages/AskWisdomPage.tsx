import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Brain, Layers, Shield } from 'lucide-react';
import aiService from '../services/aiService';

const AskWisdomPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  const userMessage = { role: 'user' as const, content: query };
  setMessages(prev => [...prev, userMessage]);
  const currentQuery = query;
  setQuery('');
  setIsLoading(true);

  try {
    const response = await aiService.askQuestion(currentQuery);
    
    const assistantMessage = {
      role: 'assistant' as const,
      content: response.answer
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = {
      role: 'assistant' as const,
      content: 'Sorry, I encountered an error. Please try again.'
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

  const suggestedQuestions = [
    "What is the remittance process for international transfers?",
    "How do I access the Treasury FX guidelines?",
    "What are the compliance requirements for new merchants?",
    "Show me the latest sales playbook"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/Fincra_coloured_full_logo.png" 
                alt="Fincra" 
                className="h-10 sm:h-12 transition-transform hover:scale-105 cursor-pointer"
                onClick={() => navigate('/')}
              />
              <h1 
                className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/')}
              >
                Wisdom
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => navigate('/category')}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-medium"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Category</span>
              </button>

              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              <button className="p-1 hover:scale-110 transition-transform">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
                  P
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            {/* Header Section */}
            <div className="mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 mx-auto overflow-hidden shadow-lg">
                <img 
                  src="/images/brain-wisdom.png" 
                  alt="Wisdom Brain" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image doesn't load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.brain-emoji')) {
                      const emoji = document.createElement('div');
                      emoji.className = 'brain-emoji text-5xl';
                      emoji.textContent = '🧠';
                      parent.appendChild(emoji);
                    }
                  }}
                />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Ask Wisdom
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                What do you need to know to win today?
              </p>
            </div>

            {/* Chat Box - Moved immediately after heading */}
            <div className="w-full max-w-3xl mb-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg border-2 border-purple-100 focus-within:border-purple-300 transition-all">
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask me anything about Fincra's processes, documents, or departments..."
                      className="w-full px-6 py-4 pr-14 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400"
                      rows={1}
                      style={{ minHeight: '60px', maxHeight: '200px' }}
                    />
                    <button
                      type="submit"
                      disabled={!query.trim() || isLoading}
                      className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Press Enter to send, Shift + Enter for new line
                </p>
              </form>
            </div>

            {/* Suggestions - Smaller and tighter */}
            <div className="w-full max-w-3xl">
              <p className="text-xs text-gray-500 mb-3">Suggestions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(question)}
                    className="text-left p-3 bg-white/70 backdrop-blur-sm border border-purple-100 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-xs text-gray-700 hover:text-purple-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-6 space-y-6">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/70 backdrop-blur-sm border border-purple-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 pb-6">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg border-2 border-purple-100 focus-within:border-purple-300 transition-all">
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask me anything about Fincra's processes, documents, or departments..."
                      className="w-full px-6 py-4 pr-14 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400"
                      rows={1}
                      style={{ minHeight: '60px', maxHeight: '200px' }}
                    />
                    <button
                      type="submit"
                      disabled={!query.trim() || isLoading}
                      className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Press Enter to send, Shift + Enter for new line
                </p>
              </form>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-xs">
            © 2025 Fincra Wisdom. Powered by AI to help you achieve your goals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AskWisdomPage;
