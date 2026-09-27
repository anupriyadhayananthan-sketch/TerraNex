import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { getAnswer } from '../utils/chatbotEngine';
import { getAllProjects } from '../utils/dataLoader';
import knowledgeBaseData from '../data/chatbot_knowledge_base.json';

export default function ProjectAssistant({ currentProject }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const allProjects = getAllProjects();

  // Reset conversation when navigating to a different project
  useEffect(() => {
    if (currentProject) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Hello! I'm your Rule-Based Assistant for ${currentProject.name} (${currentProject.id}). Ask me why this project is risky, what actions to take, or general RFCTLARR Act questions!`
        }
      ]);
    }
  }, [currentProject?.id]);

  // Auto-scroll chat list to bottom
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Append user message
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Compute answer instantly using chatbotEngine
    const answer = getAnswer(text, currentProject, allProjects, knowledgeBaseData);
    const botMsg = { id: `bot-${Date.now() + 1}`, sender: 'assistant', text: answer };
    
    setMessages(prev => [...prev, botMsg]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Why is this risky?",
    "What should I do?",
    "What is Section 19?",
    "How many high-risk projects in Bihar?"
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[480px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Rule-Based Project Assistant
              <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                Offline Logic
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Instant rule-matched guidance for {currentProject?.id || 'this project'}
            </p>
          </div>
        </div>

        <HelpCircle className="w-4 h-4 text-slate-500 hidden sm:block" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto my-3.5 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            
            <div
              className={`${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white self-end ml-auto max-w-[85%] rounded-2xl rounded-tr-none px-4 py-2.5 text-xs shadow-md font-medium'
                  : 'bg-slate-800 text-slate-200 self-start mr-auto max-w-[85%] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs border border-slate-700/80 shadow-md leading-relaxed'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="pt-2 pb-2 flex flex-wrap gap-1.5">
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 border border-slate-700/60 hover:border-indigo-500/50 px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{sug}</span>
          </button>
        ))}
      </div>

      {/* Input Box & Send Button */}
      <div className="relative flex items-center mt-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this project or RFCTLARR Act..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 text-slate-100 text-xs rounded-xl pl-3.5 pr-12 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
        />
        <button
          onClick={() => handleSend()}
          aria-label="Send message"
          className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md shadow-indigo-600/30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Honesty Framing Footer */}
      <div className="mt-2 text-[10px] text-slate-500 text-center">
        Rule-based assistant — matches your question to known patterns, not a live AI model
      </div>

    </div>
  );
}
