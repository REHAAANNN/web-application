import { User, Bot, Code } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-3xl ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* SQL Display */}
        {message.sql && (
          <div className="mt-2 bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <Code className="w-4 h-4" />
              <span>Generated SQL</span>
            </div>
            <pre className="text-sm text-green-400 overflow-x-auto">
              <code>{message.sql}</code>
            </pre>
          </div>
        )}

        {/* Results Display */}
        {message.results && message.results.length > 0 && (
          <div className="mt-2">
            <ResultsDisplay results={message.results} />
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};
