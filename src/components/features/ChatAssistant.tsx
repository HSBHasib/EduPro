"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api, ChatSession, ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ChatAssistant() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Explain React hooks",
    "What is machine learning?",
    "Help me study for exams",
    "Summarize JavaScript closures",
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadSessions() {
    try {
      const res = await api.chat.sessions();
      setSessions(res.data);
    } catch {}
  }

  async function loadSession(sessionId: string) {
    try {
      const res = await api.chat.getSession(sessionId);
      setMessages(res.data.messages);
      setCurrentSession(sessionId);
      setShowHistory(false);
    } catch {}
  }

  function newChat() {
    setCurrentSession(null);
    setMessages([]);
    setInput("");
  }

  async function sendMessage(message: string) {
    if (!message.trim() || loading) return;

    const sessionId = currentSession || `chat-${Date.now()}`;
    if (!currentSession) setCurrentSession(sessionId);

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let assistantMessage = "";
      const modelMessage: ChatMessage = {
        role: "model",
        content: "",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, modelMessage]);

      for await (const chunk of api.chat.stream(sessionId, message)) {
        assistantMessage += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...modelMessage,
            content: assistantMessage,
          };
          return updated;
        });
      }

      loadSessions();
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "model",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      await api.chat.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      if (currentSession === sessionId) newChat();
    } catch {}
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-dark-700">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-400" />
          AI Chat Assistant
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
            History
          </Button>
          <Button variant="ghost" size="sm" onClick={newChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-3 dark:border-dark-700 dark:bg-dark-900">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">No chat history yet.</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className={cn(
                      "group flex items-center justify-between rounded-lg p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700",
                      currentSession === session.sessionId && "bg-brand-300/10"
                    )}
                    onClick={() => loadSession(session.sessionId)}
                  >
                    <span className="line-clamp-1 flex-1 text-gray-700 dark:text-gray-300">
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.sessionId);
                      }}
                      className="ml-2 hidden text-gray-400 hover:text-red-500 group-hover:block"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-300 to-warm-300">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  How can I help you learn?
                </h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  Ask me anything about your studies.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-400 dark:hover:bg-dark-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-brand-300 to-brand-400 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-dark-700 dark:text-white"
                      )}
                    >
                      {msg.content || (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 dark:border-dark-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                size="lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}