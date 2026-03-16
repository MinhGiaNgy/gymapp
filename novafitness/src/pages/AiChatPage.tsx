import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, type ChatMessage } from '../api';
import { useAuth } from '../auth/useAuth';
import AuthPrompt from '../components/AuthPrompt';

const starterMessage: ChatMessage = {
  role: 'assistant',
  content:
    'I am your training coach. Ask me about weightlifting, nutrition, or health, and I can use your progress + workout plan data for personalized guidance.',
};

const AiChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const nextHistory = [...messages, userMessage].slice(-10);
    setMessages(nextHistory);
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const response = await api.chatWithAiCoach({
        message: trimmed,
        history: nextHistory.filter((message) => message.role === 'user' || message.role === 'assistant'),
      });

      const assistantMessage: ChatMessage = { role: 'assistant', content: response.reply };
      setMessages((current) => [...current, assistantMessage].slice(-12));
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to get AI response.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="page-panel">
      <div className="page-header">
        <h1>AI Coach</h1>
      </div>
      <p className="section-note">
        Scope: weightlifting, nutrition, and health only. The coach ignores unrelated topics and security-sensitive prompts.
      </p>

      {!user || showAuthPrompt ? (
        <AuthPrompt message="Sign up or log in to chat with AI using your workout plan and progress data." />
      ) : null}

      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isSending ? <div className="chat-bubble assistant">Thinking...</div> : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about training, nutrition, or your recent progress"
          className="search-input"
          maxLength={1800}
        />
        <button type="submit" className="primary-button" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
};

export default AiChatPage;
