import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import {
  AudioLines,
  Grid,
  Mic,
  Music,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function getMessageText(message: UIMessage): string {
  const legacyMessage = message as UIMessage & {
    content?: string;
  };

  if (typeof legacyMessage.content === 'string') {
    return legacyMessage.content;
  }

  if (!Array.isArray(message.parts)) {
    return '';
  }

  return message.parts
    .filter(
      (
        part,
      ): part is Extract<
        UIMessage['parts'][number],
        { type: 'text' }
      > => part.type === 'text',
    )
    .map((part) => part.text)
    .join('');
}

export function ChatUI() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
    transport,
  });

  const [input, setInput] = useState('');
  const [followNewestMessage, setFollowNewestMessage] =
    useState(true);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const isGenerating =
    status === 'streaming' || status === 'submitted';

  const scrollToBottom = (
    behavior: ScrollBehavior = 'smooth',
  ) => {
    const panel = chatContentRef.current;

    if (!panel) {
      return;
    }

    panel.scrollTo({
      top: panel.scrollHeight,
      behavior,
    });
  };

  const handleConversationScroll = () => {
    const panel = chatContentRef.current;

    if (!panel) {
      return;
    }

    const distanceFromBottom =
      panel.scrollHeight -
      panel.scrollTop -
      panel.clientHeight;

    setFollowNewestMessage(distanceFromBottom < 100);
  };

  useEffect(() => {
    if (!followNewestMessage) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      scrollToBottom('smooth');
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [messages, isGenerating, followNewestMessage]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || isGenerating) {
      return;
    }

    setFollowNewestMessage(true);

    sendMessage({
      parts: [
        {
          type: 'text',
          text: message,
        },
      ],
    });

    setInput('');

    requestAnimationFrame(() => {
      scrollToBottom('smooth');
    });
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="chat-logo">
          Goatin<span className="glowing-o">o</span>
        </h1>
      </header>

      <main className="chat-main">
        <div className="chat-watermark" aria-hidden="true">
          <span className="watermark-o">o</span>
        </div>

        <div
          ref={chatContentRef}
          className="chat-content"
          onScroll={handleConversationScroll}
        >
          {error && (
            <div className="chat-error-banner">
              <strong>Chat error:</strong> {error.message}
            </div>
          )}

          {messages.length === 0 && (
            <div className="empty-chat-placeholder">
              <p>
                What kind of music are you looking for today?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${
                message.role === 'user'
                  ? 'message-user'
                  : 'message-ai'
              }`}
            >
              <div className="message-bubble markdown-message">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getMessageText(message)}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="chat-bottom">
        <div className="pills-container">
          <button
            type="button"
            className="suggestion-pill"
            onClick={() => setInput('Try Connectors')}
          >
            <Grid className="pill-icon" size={16} />
            Try Connectors
          </button>

          <button
            type="button"
            className="suggestion-pill"
            onClick={() => setInput('Try Skills')}
          >
            <Sparkles className="pill-icon" size={16} />
            Try Skills
          </button>

          <button
            type="button"
            className="suggestion-pill"
            onClick={() =>
              setInput('Generate a beat for me')
            }
          >
            <Music className="pill-icon" size={16} />
            Generate Beat
          </button>
        </div>

        <form
          className="chat-input-box"
          onSubmit={handleSubmit}
        >
          <div className="input-top-row">
            <input
              className="chat-input"
              type="text"
              placeholder="Ask Anything"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
            />
          </div>

          <div className="input-bottom-row">
            <div className="input-actions-left">
              <button
                type="button"
                className="input-icon-btn"
                aria-label="Add attachment"
              >
                <Plus size={20} />
              </button>

              <div className="fast-badge">
                <Zap size={14} className="zap-icon" />
                Fast
              </div>
            </div>

            <div className="input-actions-right">
              <button
                type="button"
                className="input-icon-btn"
                aria-label="Voice input"
              >
                <Mic size={20} />
              </button>

              <button
                className="speak-btn"
                type="submit"
                disabled={isGenerating}
              >
                <AudioLines size={16} />
                {isGenerating ? 'Waiting...' : 'Speak'}
              </button>
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
}
