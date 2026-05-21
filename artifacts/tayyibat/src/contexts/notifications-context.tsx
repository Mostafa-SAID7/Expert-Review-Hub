import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: number;
  icon?: "meal" | "water" | "plan" | "system";
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  clearAll: () => {},
});

function loadFromStorage(): AppNotification[] {
  try {
    const raw = localStorage.getItem("tayyibat_notifications");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveToStorage(ns: AppNotification[]) {
  try {
    localStorage.setItem("tayyibat_notifications", JSON.stringify(ns.slice(0, 20)));
  } catch {}
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadFromStorage);

  const addNotification = useCallback((n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    setNotifications(prev => {
      const next = [
        { ...n, id: `${Date.now()}-${Math.random()}`, read: false, createdAt: Date.now() },
        ...prev,
      ].slice(0, 20);
      saveToStorage(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try { localStorage.removeItem("tayyibat_notifications"); } catch {}
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
