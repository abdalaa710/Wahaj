"""
Database Execution Service for NL2SQL
=====================================
Executes validated, read-only SQL queries against the official SQLite database.
Handles execution errors, captures execution time, and structures output.
"""

import os
import sqlite3
import time
from typing import Dict, Any, Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "wahaj_official.db")
if not os.path.exists(DEFAULT_DB_PATH):
    DEFAULT_DB_PATH = r"E:\WAHAJ_Sample_Data_Handoff_v0.1\01_Database\wahaj.db"

class DatabaseService:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or DEFAULT_DB_PATH

    def execute_query(self, sql: str) -> Dict[str, Any]:
        """
        Executes a validated SELECT query and returns rows, column names, count, and execution time.
        """
        if not os.path.exists(self.db_path):
            return {
                "success": False,
                "error": f"Database file not found at: {self.db_path}",
                "columns": [],
                "rows": [],
                "row_count": 0,
                "execution_time_ms": 0.0
            }

        start_time = time.perf_counter()
        conn = None
        try:
            # Connect in URI read-only mode to prevent any modification at the SQLite engine level
            uri_path = f"file:{os.path.abspath(self.db_path)}?mode=ro"
            conn = sqlite3.connect(uri_path, uri=True, timeout=10.0)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute(sql)
            results = cursor.fetchall()
            
            columns = [col[0] for col in cursor.description] if cursor.description else []
            rows = [dict(row) for row in results]
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

            return {
                "success": True,
                "error": None,
                "columns": columns,
                "rows": rows,
                "row_count": len(rows),
                "execution_time_ms": elapsed_ms
            }
        except sqlite3.Error as e:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "error": f"SQLite execution error: {str(e)}",
                "columns": [],
                "rows": [],
                "row_count": 0,
                "execution_time_ms": elapsed_ms
            }
        finally:
            if conn:
                conn.close()

db_service = DatabaseService()
