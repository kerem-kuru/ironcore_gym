import React, { useState, useRef, useEffect } from 'react';
import { streamGeminiResponse } from '../services/geminiService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'init', role: 'model', text: 'Selam! Ben IronCoach. Antrenman programın, beslenme veya üyeliklerimiz hakkında sorun var mı? Bahane kabul etmiyorum!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder for the bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      const stream = await streamGeminiResponse(
        messages.map(m => ({ role: m.role, text: m.text })), 
        userMsg.text
      );

      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
            fullText += chunkText;
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, text: fullText } : msg
                )
            );
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Bağlantı koptu asker! Tekrar dene.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-yellow-500 text-black p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-robot text-xl"></i>
              <h3 className="font-bold font-display text-lg">IRON COACH AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-zinc-800 transition">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-yellow-500 text-black rounded-tr-none font-semibold'
                      : 'bg-zinc-800 text-gray-200 border border-zinc-700 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-zinc-800 p-3 rounded-lg rounded-tl-none border border-zinc-700">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Antrenman hakkında sor..."
              className="flex-1 bg-zinc-900 text-white border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded w-10 flex items-center justify-center disabled:opacity-50 transition"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'scale-0' : 'scale-100'
        } transition-transform duration-300 bg-yellow-500 hover:bg-yellow-400 text-black w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl border-2 border-black`}
      >
        <i className="fa-solid fa-dumbbell"></i>
      </button>
    </div>
  );
};

export default Chatbot;
