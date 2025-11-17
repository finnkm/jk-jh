import { useState } from "react";
import * as crypto from "crypto-js";
import { get, onValue, push, ref, remove } from "firebase/database";
import { database } from "@/lib/firebase";

export type MessageRequest = {
  name: string;
  content: string;
  password: string;
  createdAt: number;
};

export type MessageResponse = {
  id: string;
  name: string;
  content: string;
  password: string;
  createdAt: number;
};

export const useFirebaseDatabase = () => {
  const [loading, setLoading] = useState(false);

  // 비밀번호 해싱 함수
  const hashPassword = (password: string): string => {
    return crypto.SHA256(password).toString();
  };

  // 메시지 추가
  const addMessage = async ({ name, content, password }: MessageRequest): Promise<void> => {
    setLoading(true);
    try {
      const messagesRef = ref(database, "messages");
      const passwordHash = hashPassword(password);
      const newMessage: MessageRequest = {
        name,
        content,
        password: passwordHash,
        createdAt: Date.now(),
      };

      await push(messagesRef, newMessage);
    } catch (error) {
      throw new Error("Failed to add message: " + error);
    } finally {
      setLoading(false);
    }
  };

  // 메시지 삭제 (비밀번호 확인 포함)
  const deleteMessage = async (messageId: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const messageRef = ref(database, `messages/${messageId}`);

      // 메시지 정보 가져오기
      const snapshot = await get(messageRef);

      if (!snapshot.exists()) {
        throw new Error("메시지를 찾을 수 없습니다.");
      }

      const messageData = snapshot.val();
      const passwordHash = hashPassword(password);

      // 비밀번호 검증
      if (messageData.password !== passwordHash) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      // 메시지 삭제
      await remove(messageRef);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete message: " + error);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 메시지 목록 구독
  const subscribeToMessages = (callback: (messages: MessageResponse[]) => void): (() => void) => {
    const messagesRef = ref(database, "messages");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const messagesData = snapshot.val();
      const messages: MessageResponse[] = [];

      Object.keys(messagesData).forEach((key) => {
        messages.push({
          id: key,
          ...messagesData[key],
        });
      });

      // 최신순으로 정렬
      callback(messages.sort((a, b) => b.createdAt - a.createdAt));
    });

    return unsubscribe;
  };

  return {
    addMessage,
    deleteMessage,
    subscribeToMessages,
    loading,
  };
};
