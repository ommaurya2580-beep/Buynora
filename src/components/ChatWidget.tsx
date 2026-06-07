import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hi there! 👋 I am Nifty, your Buynora AI assistant. How can I help you today? You can ask me about tracking, coupons, or return policies!",
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulated chatbot intelligence
    setTimeout(() => {
      let botResponse = "I'm not sure I understand that. Feel free to browse our categories or check your Dashboard settings!";
      const txt = userMsg.text.toLowerCase();

      if (txt.includes('track') || txt.includes('order') || txt.includes('delivery')) {
        botResponse = "To track your orders in real-time, navigate to your User Dashboard and click 'Order History', or go directly to our dedicated Order Tracking page! 🚚";
      } else if (txt.includes('coupon') || txt.includes('discount') || txt.includes('offer') || txt.includes('promo')) {
        botResponse = "We have active coupons available! Try using code WELCOME10 for 10% off or SAVE20 for 20% off. You can apply them in your Cart or Checkout page. 🎟️";
      } else if (txt.includes('return') || txt.includes('refund') || txt.includes('exchange')) {
        botResponse = "No worries! We offer a 30-day return policy on all electronics, and 14 days on footwear/apparel. Items must be unworn and in original packaging. 📦";
      } else if (txt.includes('reward') || txt.includes('points') || txt.includes('refer')) {
        botResponse = "You earn 10 points for every dollar spent, and points can be redeemed at checkout for direct cashback discounts! Share your referral link from the dashboard to earn even more. 💎";
      } else if (txt.includes('hello') || txt.includes('hi ') || txt.includes('hey')) {
        botResponse = "Hello! Hope you are having a fantastic shopping day at Buynora. What can I look up for you? 🛍️";
      }

      setMessages(prev => [...prev, {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="w-[350px] sm:w-[380px] h-[500px] rounded-3xl glass shadow-2xl border border-white/10 dark:border-white/5 flex flex-col mb-4 overflow-hidden bg-white/95 dark:bg-slate-900/95"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-text-inverted flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white/15 rounded-xl">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wide">Buynora Live Help</h4>
                  <span className="text-[10px] text-indigo-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    AI Agent Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-text-inverted/80 hover:text-text-inverted hover:bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`p-1.5 rounded-xl flex-shrink-0 self-end ${
                    msg.sender === 'bot' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-[70%]">
                    <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-text-inverted rounded-br-none' 
                        : 'bg-gray-100 dark:bg-slate-800 text-text-secondary rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[9px] text-gray-400 mt-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-500 self-end">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none max-w-[70%] flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-gray-800/50 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 dark:bg-slate-800 text-xs text-text-primary rounded-xl px-4 py-2.5 border border-transparent focus:border-indigo-500 outline-none transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 text-text-inverted rounded-xl hover:bg-indigo-700 cursor-pointer shadow transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-indigo-600 hover:bg-indigo-700 text-text-inverted rounded-full shadow-2xl shadow-indigo-600/30 flex items-center justify-center cursor-pointer relative"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

    </div>
  );
};
