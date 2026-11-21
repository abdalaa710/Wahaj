"""
Stage 2: LLM Response Generation Service
========================================
Processes retrieved database records and synthesizes a dynamic, human-readable natural language response.
Supports multi-turn conversation context and direct conversational answering without SQL.
"""

import json
from typing import List, Dict, Any, Tuple, Optional
from .llm_client import llm_client

STAGE2_SYSTEM_PROMPT = """You are WAHAJ's Expert NASA Combustion AI Research Assistant.
Your mission is to provide an articulate, human, and comprehensive scientific response answering the user's question, ENRICHED WITH the authentic database records retrieved from NASA's microgravity combustion archives.

CRITICAL PRESENTATION RULES:
1. DO NOT mention SQL, queries, table joins, or database technicalities. All database retrieval is strictly internal background context.
2. DO NOT dump raw JSON or raw table rows. Instead, weave the findings naturally into clear, well-written prose with bullet points or formatted highlights where appropriate.
3. Base your facts, numbers, names, and findings strictly on the provided database records without hallucinating.
4. Support multi-turn conversation: if the user refers to previous experiments or topics ("it", "that", "the previous one"), resolve references using the conversation history.
5. If no records match, explain clearly and helpfully what was searched.
6. If the user writes in Arabic, respond in rich, professional scientific Arabic. If in English, respond in English.
"""

CONVERSATIONAL_SYSTEM_PROMPT = """You are WAHAJ's Expert NASA Combustion AI Research Assistant.
You are interacting with researchers, students, and engineers exploring microgravity fire safety, spaceflight combustion kinetics, and NASA flight investigations.

RULES:
1. Greet and interact with the user warmly, professionally, and naturally.
2. Explain your capabilities: navigating NASA microgravity investigations (FLEX, SAFFIRE, BASS, ACME CFI-G, SPICE, SAME-R), analyzing physical outcomes (temperatures, burn rates, cool flames, extinction limits), and exploring flight telemetry.
3. If the user asks in Arabic, reply in fluent, welcoming Arabic. If in English, reply in English.
"""

def generate_answer(
    user_question: str,
    sql_query: str,
    records: List[Dict[str, Any]],
    row_count: int,
    error_message: Optional[str] = None,
    chat_history: Optional[List[Dict[str, str]]] = None
) -> Tuple[str, str]:
    """
    Stage 2 LLM Call: Generates a natural language answer from retrieved database rows and conversation history.
    """
    if error_message:
        return (
            f"I was unable to retrieve the requested records due to: {error_message}. "
            "Please try rephrasing your question or specify the research area, material, or NASA project acronym."
        ), "system"

    # Truncate records preview for LLM prompt context to keep within token budget
    preview_records = records[:30]
    records_str = json.dumps(preview_records, indent=2, default=str)

    messages = []
    if chat_history:
        messages.extend(chat_history)

    prompt = (
        f"User Question: {user_question}\n"
        f"Verified Background Records Count: {row_count}\n"
        f"Retrieved Evidence Data:\n{records_str}\n\n"
        f"Please write a comprehensive, human-readable response that answers the user's question naturally, incorporating the specific names, numbers, and facts from the evidence data above:"
    )
    messages.append({"role": "user", "content": prompt})

    answer, provider = llm_client.chat(messages, STAGE2_SYSTEM_PROMPT)
    return answer.strip(), provider

def generate_conversational_answer(
    user_question: str,
    chat_history: Optional[List[Dict[str, str]]] = None
) -> Tuple[str, str]:
    """
    Direct LLM Call for general conversational questions that do not require database querying.
    """
    messages = []
    if chat_history:
        messages.extend(chat_history)
    messages.append({"role": "user", "content": user_question})

    answer, provider = llm_client.chat(messages, CONVERSATIONAL_SYSTEM_PROMPT)
    return answer.strip(), provider
