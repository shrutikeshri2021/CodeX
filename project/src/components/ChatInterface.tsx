import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types';

// ✅ Secure API Key (Replace with your actual key in backend)
const GEMINI_API_KEY = "AIzaSyBDBE6DBbJh0-uT83NFAOno8HsY4Ohj-_M";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// ✅ Fetch slang meaning using Gemini API
const fetchGeminiResponse = async (slang: string) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `What does the slang term "${slang}" mean? Explain simply.` }]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return "Couldn't fetch slang meaning.";
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I don't know that slang.";
  } catch (error) {
    console.error("API Fetch Error:", error);
    return "Error fetching slang meaning.";
  }
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const newMessage: Partial<ChatMessage> = {
      content: input,
      is_ai: false,
      user_id: userId,
    };

    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, newMessage as ChatMessage]);

    try {
      const slangMeaning = await fetchGeminiResponse(input);
      const aiResponse: Partial<ChatMessage> = {
        content: slangMeaning,
        is_ai: true,
        user_id: userId,
      };

      setMessages((prev) => [...prev, aiResponse as ChatMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="glass neon-border rounded-lg flex-1 flex flex-col overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.is_ai ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div className={`max-w-[80%] p-4 rounded-lg ${message.is_ai ? 'glass' : 'bg-primary text-primary-foreground neon-border'}`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
        <form onSubmit={sendMessage} className="p-4 border-t border-border/50">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a slang word..."
              disabled={loading}
              className="h-11"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="h-11 px-6">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
