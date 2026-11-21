"""
SQL Security Validator & Sanitizer for NL2SQL
=============================================
Enforces:
- SELECT queries ONLY (strictly forbids DML, DDL, PRAGMA, ATTACH, etc.)
- Multi-statement prevention (rejects semicolon chaining)
- Table whitelisting (investigations, measured_outcomes, source_files only)
- Unconfirmed JOIN detection (flags invalid joins between measured_outcomes and investigations)
- Automatic LIMIT enforcement (default 50, max 200)
"""

import re
from typing import Tuple, Optional
from .schema_context import ALLOWED_TABLES

# Forbidden keywords / operations
FORBIDDEN_KEYWORDS = [
    r"\bINSERT\b", r"\bUPDATE\b", r"\bDELETE\b", r"\bDROP\b", r"\bALTER\b",
    r"\bCREATE\b", r"\bREPLACE\b", r"\bTRUNCATE\b", r"\bATTACH\b", r"\bDETACH\b",
    r"\bPRAGMA\b", r"\bVACUUM\b", r"\bREINDEX\b", r"\bEXEC\b", r"\bEXECUTE\b",
    r"\bINTO\s+OUTFILE\b", r"\bLOAD_FILE\b", r"\bSCRIPT\b"
]

def clean_sql(raw_sql: str) -> str:
    """Strips markdown code fences, trailing semicolons, and excess whitespace."""
    sql = raw_sql.strip()
    # Strip markdown ```sql ... ```
    if sql.startswith("```"):
        lines = sql.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        sql = "\n".join(lines).strip()
    # Remove trailing semicolons for validation
    sql = re.sub(r";+\s*$", "", sql).strip()
    return sql

def validate_and_sanitize_sql(raw_sql: str) -> Tuple[bool, str, Optional[str]]:
    """
    Validates the generated SQL for safety, schema compliance, and injection prevention.
    
    Returns:
        (is_valid: bool, sanitized_sql: str, error_message: Optional[str])
    """
    sql = clean_sql(raw_sql)
    if not sql:
        return False, "", "Empty SQL query."

    # 1. Multi-statement check: ensure no internal semicolons separating statements
    statements = [s.strip() for s in sql.split(";") if s.strip()]
    if len(statements) > 1:
        return False, "", "Multiple SQL statements are strictly prohibited for security."

    single_sql = statements[0]

    # 2. Must start with SELECT or WITH (for CTEs leading to SELECT)
    if not re.match(r"^(SELECT|WITH)\b", single_sql, re.IGNORECASE):
        return False, "", "Security Violation: Only SELECT queries are permitted."

    # 3. Check for any forbidden destructive keywords anywhere in query
    for kw_regex in FORBIDDEN_KEYWORDS:
        if re.search(kw_regex, single_sql, re.IGNORECASE):
            return False, "", f"Security Violation: Forbidden keyword detected matching pattern: {kw_regex}"

    # 4. Table Whitelist Verification
    # Extract candidate table names following FROM or JOIN
    from_join_pattern = r"(?:FROM|JOIN)\s+([a-zA-Z0-9_]+)"
    referenced_tables = re.findall(from_join_pattern, single_sql, re.IGNORECASE)
    for tbl in referenced_tables:
        tbl_clean = tbl.lower().strip()
        if tbl_clean not in ALLOWED_TABLES:
            return False, "", (
                f"Schema Violation: Table '{tbl}' is not in the allowed database schema. "
                f"Allowed tables are: {', '.join(sorted(ALLOWED_TABLES))}."
            )

    # 5. Check for unconfirmed JOIN between measured_outcomes and investigations
    # E.g., ON measured_outcomes.run_id = investigations.investigation_id
    unconfirmed_join = re.search(
        r"(measured_outcomes\s*.*investigations|investigations\s*.*measured_outcomes)",
        single_sql,
        re.IGNORECASE
    )
    if unconfirmed_join and "JOIN" in single_sql.upper():
        if re.search(r"run_id\s*=\s*(?:[a-zA-Z_]+\.)?investigation_id", single_sql, re.IGNORECASE) or \
           re.search(r"investigation_id\s*=\s*(?:[a-zA-Z_]+\.)?run_id", single_sql, re.IGNORECASE):
            return False, "", (
                "Unconfirmed Relationship: The relationship between measured_outcomes.run_id and "
                "investigations.investigation_id has NOT been confirmed in the schema. "
                "Direct joins between these tables are not permitted without schema clarification."
            )

    # 6. Automatic LIMIT Enforcement
    # If no LIMIT clause is present, append LIMIT 50. If LIMIT > 200, cap at 200.
    limit_match = re.search(r"\bLIMIT\s+(\d+)\b", single_sql, re.IGNORECASE)
    if limit_match:
        limit_val = int(limit_match.group(1))
        if limit_val > 200:
            single_sql = re.sub(r"\bLIMIT\s+\d+\b", "LIMIT 200", single_sql, flags=re.IGNORECASE)
    else:
        # Don't add LIMIT if the query is a simple aggregate without GROUP BY (e.g. SELECT COUNT(*) FROM ...)
        is_pure_aggregate = re.match(
            r"^SELECT\s+(COUNT|AVG|MIN|MAX|SUM)\s*\(",
            single_sql,
            re.IGNORECASE
        ) and not re.search(r"\bGROUP\s+BY\b", single_sql, re.IGNORECASE)

        if not is_pure_aggregate:
            single_sql = f"{single_sql} LIMIT 50"

    return True, single_sql, None
