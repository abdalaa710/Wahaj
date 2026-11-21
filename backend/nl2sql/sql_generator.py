"""
Stage 1: Natural Language to SQL Generation Service
==================================================
Converts user prompts into SQLite-compatible SELECT queries using LLM with validation and automatic correction.
"""

from typing import Tuple, Optional
from .schema_context import get_schema_prompt_context
from .sql_validator import validate_and_sanitize_sql, clean_sql
from .llm_client import llm_client

STAGE1_SYSTEM_PROMPT = f"""You are an expert SQLite Database Specialist for NASA spaceflight combustion research.
Your job is to convert natural language questions into valid, secure, SQLite-compatible SQL queries.

{get_schema_prompt_context()}

STRICT OUTPUT RULES:
1. Output ONLY the raw SQL query. Do NOT include markdown fences, conversational text, explanations, or quotes.
2. Use SELECT queries ONLY. Never use INSERT, UPDATE, DELETE, DROP, ALTER, PRAGMA.
3. Use ONLY the 3 allowed tables: investigations, measured_outcomes, source_files.
4. For JOINs between investigations and source_files, use: investigations.investigation_id = source_files.investigation_id.
5. NEVER attempt a direct JOIN between measured_outcomes and investigations (relationship is unconfirmed).
6. Use appropriate aggregations (COUNT, AVG, MIN, MAX, SUM), WHERE filtering, ORDER BY, and LIMIT when relevant.
7. Return clean, efficient SQLite SQL.
"""

def generate_sql(user_question: str, max_retries: int = 2) -> Tuple[str, bool, Optional[str], str]:
    """
    Stage 1 LLM Call: Converts user question into a validated SQLite query.
    Performs up to `max_retries` self-correction attempts if validation fails.
    
    Returns:
        (sql_query: str, is_valid: bool, error_message: Optional[str], provider_used: str)
    """
    user_prompt = f"User Question: {user_question}\n\nGenerate a valid SQLite SELECT query to answer this question:"
    
    current_prompt = user_prompt
    last_error = None
    provider_used = "unknown"

    for attempt in range(max_retries + 1):
        raw_response, provider = llm_client.generate(current_prompt, STAGE1_SYSTEM_PROMPT)
        provider_used = provider
        sql = clean_sql(raw_response)
        
        # Validate query
        is_valid, sanitized_sql, error = validate_and_sanitize_sql(sql)
        if is_valid:
            return sanitized_sql, True, None, provider_used
        
        last_error = error
        # Prepare self-correction prompt for next iteration
        current_prompt = (
            f"User Question: {user_question}\n"
            f"Your previous SQL query was:\n{sql}\n"
            f"Validation Error: {error}\n\n"
            f"Please correct the query to strictly follow the allowed schema and output ONLY the revised SQLite SELECT query:"
        )

    return "", False, f"SQL generation failed after {max_retries} correction attempts: {last_error}", provider_used
