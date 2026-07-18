// Use relative URLs — browser sends BetterAuth cookies automatically via Next.js proxy
function handleAuthError(): never {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
  if (typeof window !== "undefined") {
    window.location.href = loginUrl;
  }
  throw new Error("Unauthorized: Session expired or invalid token.");
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LearningItem {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  content: string;
  author: string;
  tags: string[];
  thumbnailUrl: string;
  sourceUrl: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  _id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface DocumentSummary {
  _id: string;
  originalName: string;
  summary: string;
  actionItems: string[];
  keyTopics: string[];
  wordCount: number;
  createdAt: string;
}

export interface Stats {
  totalItems: number;
  totalViews: number;
  categories: Array<{ _id: string; count: number }>;
  recentItems: LearningItem[];
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    handleAuthError();
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

async function fetchStream(endpoint: string, body: Record<string, unknown>): Promise<Response> {
  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    handleAuthError();
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res;
}

export const api = {
  items: {
    list: (params?: {
      search?: string;
      category?: string;
      priority?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.category) query.set("category", params.category);
      if (params?.priority) query.set("priority", params.priority);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      return fetchAPI<LearningItem[]>(`/api/items?${query.toString()}`);
    },
    get: (id: string) =>
      fetchAPI<{ item: LearningItem; relatedItems: LearningItem[] }>(`/api/items/${id}`),
    create: (data: Partial<LearningItem>) =>
      fetchAPI<LearningItem>("/api/items", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<LearningItem>) =>
      fetchAPI<LearningItem>(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ message: string }>(`/api/items/${id}`, { method: "DELETE" }),
    categories: () => fetchAPI<string[]>("/api/items/categories"),
    stats: () => fetchAPI<Stats>("/api/items/stats"),
    mine: (params?: { page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      return fetchAPI<LearningItem[]>(`/api/items/mine?${query.toString()}`);
    },
  },

  chat: {
    stream: async function* (sessionId: string, message: string, context?: string) {
      const res = await fetchStream("/api/chat/stream", { sessionId, message, context });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              if (data.done) return;
              if (data.chunk) yield data.chunk;
            } catch {}
          }
        }
      }
    },
    sessions: () => fetchAPI<ChatSession[]>("/api/chat/sessions"),
    getSession: (sessionId: string) =>
      fetchAPI<ChatSession & { messages: ChatMessage[] }>(`/api/chat/sessions/${sessionId}`),
    deleteSession: (sessionId: string) =>
      fetchAPI<{ message: string }>(`/api/chat/sessions/${sessionId}`, { method: "DELETE" }),
  },

  documents: {
    analyze: (content: string, fileName: string) =>
      fetchAPI<DocumentSummary>("/api/documents/analyze", {
        method: "POST",
        body: JSON.stringify({ content, fileName }),
      }),
    history: () => fetchAPI<DocumentSummary[]>("/api/documents/history"),
    get: (id: string) => fetchAPI<DocumentSummary>(`/api/documents/${id}`),
    delete: (id: string) =>
      fetchAPI<{ message: string }>(`/api/documents/${id}`, { method: "DELETE" }),
  },
};