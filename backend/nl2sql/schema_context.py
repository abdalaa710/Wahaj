"""
Database Schema & Context Reference for NL2SQL
==============================================
Strict reference for the 3 allowed tables:
1. investigations
2. measured_outcomes
3. source_files

CRITICAL RULES:
- Only these 3 tables exist in the schema context.
- Exact column names and types must be used.
- Relationship between investigations and source_files is CONFIRMED on investigation_id.
- Relationship between measured_outcomes.run_id and investigations.investigation_id is UNCONFIRMED.
  Do NOT assume direct join between them.
"""

SCHEMA_REFERENCE_TEXT = """
=== DATABASE SCHEMA REFERENCE (SQLite) ===

TABLE 1: investigations
Purpose: Contains general information about research investigations and experiments.
Columns:
  - investigation_id (TEXT, Primary Key): Unique ID identifying each Investigation (e.g. 'PSI-69', 'PSI-98').
  - acronym (TEXT): Short name of the research project, such as 'FLEX', 'SAFFIRE-I', 'BASS-II'.
  - title (TEXT): Full title of the research or experiment.
  - doi (TEXT): Digital Object Identifier used to identify and access the research source.
  - research_area (TEXT): Scientific field associated with the investigation (e.g. 'Droplet Combustion', 'Solid Combustion').
  - managing_center (TEXT): Research center responsible for managing the Investigation (e.g. 'NASA Glenn Research Center (GRC)').
  - facility_hardware (TEXT): Facility or hardware used during the experiment (e.g. 'MDCA', 'MSG', 'CIR').
  - lead_pi (TEXT): Principal Investigator responsible for the research.
  - description (TEXT): Detailed description of the Investigation.

TABLE 2: measured_outcomes
Purpose: Contains actual experimental measurements and observed physical outcomes.
Columns:
  - outcome_id (INTEGER, Primary Key): Unique ID for each outcome record.
  - run_id (INTEGER): Identifies the Experiment Run associated with the measurements.
  - burn_duration_s (REAL): Burning duration in seconds.
  - burning_rate_mm2_s (REAL): Burning rate in mm²/s.
  - extinction_diameter_mm (REAL): Extinction diameter in millimeters.
  - flame_spread_rate_cm_s (REAL): Flame spread rate in cm/s.
  - extinction_mode (TEXT): Describes the extinction mode or mechanism (e.g. 'Radiative Extinction', 'Blowout').
  - cool_flame_observed (INTEGER/BOOLEAN): Indicates whether a Cool Flame was observed (1 = True, 0 = False).
  - hot_ignition (INTEGER/BOOLEAN): Indicates whether Hot Ignition occurred (1 = True, 0 = False).
  - peak_temperature_c (REAL): Maximum recorded temperature in Celsius.
  - final_oxygen_pct (REAL): Final oxygen percentage.
  - final_co2_pct (REAL): Final carbon dioxide percentage.
  - final_co_ppm (REAL): Final carbon monoxide concentration in ppm.
  - sensor_resistance_ratio (REAL): Sensor resistance ratio used in the measurements.
  - particle_aging_time_s (REAL): Particle Aging duration in seconds.
  - observation_notes (TEXT): Textual notes about the results or experimental conditions.
  - data_provenance (TEXT): Describes the source or origin of the measurement data.
  - json_attributes (TEXT): Additional attributes stored in JSON format (use json_extract(json_attributes, '$.key') in SQLite).

TABLE 3: source_files
Purpose: Contains information about files and data sources associated with each investigation.
Columns:
  - investigation_id (TEXT): Links the file to its associated Investigation (Foreign Key to investigations.investigation_id).
  - file_id (TEXT/INTEGER): Unique ID identifying each file.
  - filename (TEXT): Name of the file (e.g. 'FLEX_Data_Table.xlsx', 'flight_telemetry.csv').
  - source_role (TEXT): Classifies the file's role, such as 'Documentation', 'Experimental Table', or 'Raw Telemetry'.
  - relative_path (TEXT): Relative path used to access the file.
  - file_format (TEXT): File format, such as 'CSV', 'XLSX', 'JSON', or 'TXT'.

=== CONFIRMED RELATIONSHIPS & JOIN RULES ===
1. investigations <-> source_files:
   CONFIRMED RELATIONSHIP:
   investigations.investigation_id = source_files.investigation_id
   
   - Use LEFT JOIN when the user requests investigations regardless of whether associated source files exist.
   - Use INNER JOIN when the user explicitly requests only investigations that have matching files.

2. measured_outcomes:
   CRITICAL: The relationship between measured_outcomes.run_id and investigations.investigation_id has NOT been confirmed.
   Do NOT assume these columns are directly related.
   Do NOT generate queries that directly JOIN measured_outcomes with investigations on run_id = investigation_id.
   If a question asks for investigation-specific measured outcomes, query measured_outcomes directly or query investigations separately, and explicitly indicate that run_id to investigation_id mapping requires an unconfirmed bridge.

3. SQLite JSON Functions:
   When querying measured_outcomes.json_attributes, use SQLite JSON functions:
   e.g., json_extract(json_attributes, '$.key')

4. Security & Restrictions:
   - SELECT statements ONLY.
   - Do NOT execute INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, PRAGMA.
   - Do NOT assume any other tables exist (such as experiment_runs or authors).
   - Use uppercase for SQL keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, LIMIT).
   - Use exact table and column names as defined above.
"""

ALLOWED_TABLES = {"investigations", "measured_outcomes", "source_files"}

TABLE_COLUMNS = {
    "investigations": [
        "investigation_id", "acronym", "title", "doi", "research_area",
        "managing_center", "facility_hardware", "lead_pi", "description"
    ],
    "measured_outcomes": [
        "outcome_id", "run_id", "burn_duration_s", "burning_rate_mm2_s",
        "extinction_diameter_mm", "flame_spread_rate_cm_s", "extinction_mode",
        "cool_flame_observed", "hot_ignition", "peak_temperature_c",
        "final_oxygen_pct", "final_co2_pct", "final_co_ppm",
        "sensor_resistance_ratio", "particle_aging_time_s",
        "observation_notes", "data_provenance", "json_attributes"
    ],
    "source_files": [
        "investigation_id", "file_id", "filename", "source_role",
        "relative_path", "file_format"
    ]
}

def get_schema_prompt_context() -> str:
    return SCHEMA_REFERENCE_TEXT.strip()
