import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { Plus, Mic, AudioLines, Zap, Sparkles, Music, Grid } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

const getMessageText = (m: UIMessage) => {
  // @ts-ignore - Handle older versions if content exists
  if (m.content) return m.content;
  
  if (Array.isArray(m.parts)) {
    // @ts-ignore
    return m.parts.map(p => p.type === 'text' ? p.text : '').join('');
  }
  return '';
};

export function ChatUI() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isGenerating = status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-logo">
          Goatin<span className="glowing-o">o</span>
        </h1>
      </div>

      {/* Main Area */}
      <div className="chat-main">
        {/* Background faint watermark */}
        <div className="chat-watermark">
          <span className="watermark-o">o</span>
        </div>
        
        <div className="chat-content">
          {error && (
            <div className="chat-error-banner">
              <strong>Chat error:</strong> {error.message}
            </div>
          )}
          {messages.length === 0 && (
            <div className="empty-chat-placeholder">
              <p>What kind of music are you looking for today?</p>
            </div>
          )}
          
          {messages.map((m: UIMessage) => (
            <div key={m.id || Math.random().toString()} className={`message-wrapper ${m.role === 'user' ? 'message-user' : 'message-ai'}`}>
              <div className="message-bubble">
                {getMessageText(m)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="chat-bottom">
        {/* Pills */}
        <div className="pills-container">
          <button type="button" className="suggestion-pill" onClick={() => setInput('Try Connectors')}>
            <Grid className="pill-icon" size={16} /> Try Connectors
          </button>
          <button type="button" className="suggestion-pill" onClick={() => setInput('Try Skills')}>
            <Sparkles className="pill-icon" size={16} /> Try Skills
          </button>
          <button type="button" className="suggestion-pill" onClick={() => setInput('Generate a beat for me')}>
            <Music className="pill-icon" size={16} /> Generate Beat
          </button>
        </div>

        {/* Input Box */}
        <form onSubmit={handleSubmit} className="chat-input-box">
          <div className="input-top-row">
            <input 
              type="text" 
              placeholder="Ask Anything" 
              className="chat-input" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="input-bottom-row">
            <div className="input-actions-left">
              <button type="button" className="input-icon-btn">
                <Plus size={20} />
              </button>
              <div className="fast-badge">
                <Zap size={14} className="zap-icon" /> Fast
              </div>
            </div>
            
            <div className="input-actions-right">
              <button type="button" className="input-icon-btn">
                <Mic size={20} />
              </button>
              <button type="submit" className="speak-btn" disabled={isGenerating}>
                <AudioLines size={16} /> {isGenerating ? 'Waiting…' : 'Speak'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
