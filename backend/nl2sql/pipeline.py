"""
Complete NL2SQL & Conversational Pipeline Orchestrator
=====================================================
Workflow:
1. User Prompt
2. Intent Analysis:
   - General conversation -> Direct LLM Answer with chat history (No SQL)
   - Database inquiry -> Stage 1 LLM (SQL) -> Security Validation -> SQLite Execution -> Stage 2 LLM (Grounded Answer)
3. Return final structured response.
"""

import time
import re
from typing import Dict, Any, Optional
from .sql_generator import generate_sql
from .db_service import db_service
from .answer_generator import generate_answer, generate_conversational_answer
from .history import history_manager

CONVERSATIONAL_PATTERNS = [
    r"^(hi|hello|hey|greetings|good\s+morning|good\s+afternoon|good\s+evening)[\!\?\.\s]*$",
    r"^(مرحبا|أهلا|اهلا|السلام\s+عليكم|صباح\s+الخير|مساء\s+الخير)[\!\?\.\s]*$",
    r"^(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+your\s+name|help(\s+me)?)[\!\?\.\s]*$",
    r"^(من\s+أنت|من\s+انت|ماذا\s+تستطيع\s+أن\s+تفعل|ماذا\s+تفعل|ساعدني|مساعدة)[\!\?\.\s]*$",
    r"^(thanks|thank\s+you|appreciate\s+it|شكرا|شكراً|تسلم|يعطيك\s+العافية)[\!\?\.\s]*$",
    r"^(bye|goodbye|see\s+you|مع\s+السلامة|وداعا|إلى\s+اللقاء)[\!\?\.\s]*$"
]

def is_conversational_greeting(text: str) -> bool:
    clean = text.strip().lower()
    for pattern in CONVERSATIONAL_PATTERNS:
        if re.search(pattern, clean, re.IGNORECASE):
            return True
    return False

class NL2SQLPipeline:
    def process_query(self, question: str, session_id: Optional[str] = "default") -> Dict[str, Any]:
        """
        Processes user query: either through direct conversational LLM or the 2-stage NL2SQL RAG pipeline.
        """
        start_time = time.perf_counter()
        clean_q = question.strip()
        if not clean_q:
            return {
                "success": False,
                "question": question,
                "sql_query": None,
                "data": [],
                "columns": [],
                "row_count": 0,
                "answer": "Please ask a question regarding NASA investigations, measured outcomes, or space combustion science.",
                "execution_time_ms": 0.0,
                "provider_stage1": "none",
                "provider_stage2": "none",
                "error": "Empty question."
            }

        chat_history = history_manager.get_chat_context(session_id)

        # Route 1: General Conversational Questions (No SQL needed)
        if is_conversational_greeting(clean_q):
            answer, prov = generate_conversational_answer(clean_q, chat_history)
            total_ms = round((time.perf_counter() - start_time) * 1000, 2)
            history_manager.add_interaction(session_id, clean_q, None, answer, 0)
            return {
                "success": True,
                "question": clean_q,
                "sql_query": None,
                "data": [],
                "columns": [],
                "row_count": 0,
                "answer": answer,
                "db_execution_time_ms": 0.0,
                "total_latency_ms": total_ms,
                "provider_stage1": "none (conversational)",
                "provider_stage2": prov,
                "is_conversational": True,
                "error": None
            }

        # Route 2: Database Inquiry (NL2SQL 2-Stage Pipeline)
        # Stage 1: Generate SQL Query
        sql_query, is_valid, gen_error, prov1 = generate_sql(clean_q)
        if not is_valid or not sql_query:
            total_ms = round((time.perf_counter() - start_time) * 1000, 2)
            answer, prov2 = generate_answer(clean_q, sql_query, [], 0, error_message=gen_error, chat_history=chat_history)
            history_manager.add_interaction(session_id, clean_q, sql_query, answer, 0, error=gen_error)
            return {
                "success": False,
                "question": clean_q,
                "sql_query": sql_query,
                "data": [],
                "columns": [],
                "row_count": 0,
                "answer": answer,
                "execution_time_ms": total_ms,
                "provider_stage1": prov1,
                "provider_stage2": prov2,
                "error": gen_error
            }

        # Step 2: Execute Validated SQL against SQLite
        db_res = db_service.execute_query(sql_query)
        if not db_res["success"]:
            total_ms = round((time.perf_counter() - start_time) * 1000, 2)
            answer, prov2 = generate_answer(clean_q, sql_query, [], 0, error_message=db_res["error"], chat_history=chat_history)
            history_manager.add_interaction(session_id, clean_q, sql_query, answer, 0, error=db_res["error"])
            return {
                "success": False,
                "question": clean_q,
                "sql_query": sql_query,
                "data": [],
                "columns": [],
                "row_count": 0,
                "answer": answer,
                "execution_time_ms": total_ms,
                "provider_stage1": prov1,
                "provider_stage2": prov2,
                "error": db_res["error"]
            }

        # Step 3: Stage 2 LLM Call - Generate Answer Grounded in Retrieved Records
        records = db_res["rows"]
        row_count = db_res["row_count"]
        answer, prov2 = generate_answer(clean_q, sql_query, records, row_count, chat_history=chat_history)

        total_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Record interaction in history
        history_manager.add_interaction(session_id, clean_q, sql_query, answer, row_count)

        return {
            "success": True,
            "question": clean_q,
            "sql_query": sql_query,
            "data": records[:100],
            "columns": db_res["columns"],
            "row_count": row_count,
            "answer": answer,
            "db_execution_time_ms": db_res["execution_time_ms"],
            "total_latency_ms": total_ms,
            "provider_stage1": prov1,
            "provider_stage2": prov2,
            "is_conversational": False,
            "error": None
        }

nl2sql_pipeline = NL2SQLPipeline()
