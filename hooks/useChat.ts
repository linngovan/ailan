/**
 * Custom hook for managing chat state and operations
 * Consolidates repeated chat logic across components
 */

import { useState, useCallback } from 'react';
import { ChatMessage } from '../types.ts';
import { askFollowUp } from '../services/geminiService.ts';
import { ERROR_MESSAGES } from '../constants.ts';

export const useChat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const sendChatMessage = useCallback(
    async (
      question: string,
      contextPrompt: string,
      existingMessages: ChatMessage[]
    ): Promise<boolean> => {
      if (!question.trim()) return false;

      setIsChatLoading(true);
      const newMessages: ChatMessage[] = [
        ...existingMessages,
        { role: 'user', text: question },
      ];
      setChatMessages(newMessages);

      try {
        const response = await askFollowUp(
          contextPrompt,
          existingMessages,
          question
        );
        setChatMessages([...newMessages, { role: 'model', text: response }]);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.message || ERROR_MESSAGES.CHAT_ERROR;
        setChatMessages([
          ...newMessages,
          { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` },
        ]);
        return false;
      } finally {
        setIsChatLoading(false);
      }
    },
    []
  );

  const resetChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setChatMessages((prev: ChatMessage[]) => [...prev, message]);
  }, []);

  return {
    chatMessages,
    isChatLoading,
    sendChatMessage,
    resetChat,
    addMessage,
    setChatMessages,
  };
};
