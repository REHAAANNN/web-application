import { useState, useEffect } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

export default function ChatHistory() {
  const [history, setHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('chatHistory');
    setHistory([]);
  };

  const deleteMessage = (id: string) => {
    const updated = history.filter(msg => msg.id !== id);
    setHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No chat history yet</p>
        ) : (
          history.map((msg) => (
            <div key={msg.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-900">{msg.question}</p>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-1">{msg.answer}</p>
              <p className="text-xs text-gray-400">
                {msg.timestamp.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to save messages to localStorage
export const saveChatMessage = (question: string, answer: string) => {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  const newMessage = {
    id: Date.now().toString(),
    question,
    answer,
    timestamp: new Date().toISOString()
  };
  history.unshift(newMessage);
  // Keep only last 50 messages
  const trimmed = history.slice(0, 50);
  localStorage.setItem('chatHistory', JSON.stringify(trimmed));
};
