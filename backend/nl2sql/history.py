"""
Chat History Management for NL2SQL
==================================
Manages conversational history per session to enable context tracking and multi-turn dialogue.
"""

import time
from typing import Dict, List, Any, Optional

class ChatHistoryManager:
    def __init__(self, max_history_per_session: int = 50):
        self.sessions: Dict[str, List[Dict[str, Any]]] = {}
        self.max_history = max_history_per_session

    def add_interaction(
        self,
        session_id: str,
        question: str,
        sql_query: Optional[str],
        answer: str,
        row_count: int = 0,
        error: Optional[str] = None
    ):
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        
        self.sessions[session_id].append({
            "timestamp": time.time(),
            "question": question,
            "sql_query": sql_query,
            "answer": answer,
            "row_count": row_count,
            "error": error
        })

        if len(self.sessions[session_id]) > self.max_history:
            self.sessions[session_id] = self.sessions[session_id][-self.max_history:]

    def get_history(self, session_id: str) -> List[Dict[str, Any]]:
        return self.sessions.get(session_id, [])

    def get_chat_context(self, session_id: str, max_turns: int = 4) -> List[Dict[str, str]]:
        """Returns dialogue history formatted for LLM multi-turn completion."""
        turns = self.sessions.get(session_id, [])
        dialogue = []
        for t in turns[-max_turns:]:
            dialogue.append({"role": "user", "content": t["question"]})
            dialogue.append({"role": "assistant", "content": t["answer"]})
        return dialogue

    def clear_history(self, session_id: str):
        if session_id in self.sessions:
            del self.sessions[session_id]

history_manager = ChatHistoryManager()
