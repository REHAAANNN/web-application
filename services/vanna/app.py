from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vanna.groq import Groq_Chat
import os
from dotenv import load_dotenv
import psycopg2
from typing import List, Dict, Any
import pandas as pd

load_dotenv()

app = FastAPI(title="Vanna AI Service", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vanna with Groq
vn = None
db_connection = None

def get_db_connection():
    """Create PostgreSQL connection"""
    try:
        # Parse DATABASE_URL or use individual env vars
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            # Format: postgresql://user:password@host:port/dbname
            return psycopg2.connect(db_url)
        else:
            return psycopg2.connect(
                host=os.getenv("DB_HOST", "localhost"),
                database=os.getenv("DB_NAME", "flowbit_db"),
                user=os.getenv("DB_USER", "postgres"),
                password=os.getenv("DB_PASSWORD", "postgres123"),
                port=os.getenv("DB_PORT", "5432")
            )
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

try:
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if groq_api_key:
        vn = Groq_Chat(
            model=os.getenv("GROQ_MODEL", "llama3-groq-70b-8192-tool-use-preview"),
            api_key=groq_api_key
        )
        
        # Test database connection
        db_connection = get_db_connection()
        if db_connection:
            print("✅ Connected to PostgreSQL database")
            db_connection.close()
            
            # Train Vanna on database schema
            conn = get_db_connection()
            if conn:
                # Get schema information
                cursor = conn.cursor()
                
                # Train on DDL (Data Definition Language)
                ddl_queries = [
                    """
                    CREATE TABLE invoice (
                        id TEXT PRIMARY KEY,
                        invoice_number TEXT,
                        invoice_date TIMESTAMP,
                        status TEXT,
                        created_at TIMESTAMP,
                        vendor_id TEXT,
                        customer_id TEXT
                    );
                    """,
                    """
                    CREATE TABLE vendor (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL
                    );
                    """,
                    """
                    CREATE TABLE summary (
                        id TEXT PRIMARY KEY,
                        invoice_total DOUBLE PRECISION,
                        invoice_id TEXT
                    );
                    """
                ]
                
                for ddl in ddl_queries:
                    try:
                        vn.train(ddl=ddl)
                    except Exception as train_err:
                        print(f"⚠️ Training warning: {train_err}")
                
                conn.close()
                print("✅ Vanna trained on database schema")
        else:
            print("⚠️ Database connection failed, running in limited mode")
    else:
        print("⚠️ No GROQ_API_KEY configured, Vanna AI disabled")
        
except Exception as e:
    print(f"⚠️ Vanna initialization warning: {e}")
    print("Running in fallback mode")


class Question(BaseModel):
    question: str


class SQLQuery(BaseModel):
    sql: str


@app.get("/")
async def root():
    return {
        "service": "Vanna AI SQL Generator",
        "status": "running",
        "vanna_initialized": vn is not None,
        "database_connected": db_connection is not None
    }


@app.get("/health")
async def health_check():
    db_status = "disconnected"
    try:
        conn = get_db_connection()
        if conn:
            conn.close()
            db_status = "connected"
    except:
        pass
    
    return {
        "status": "healthy",
        "vanna": "connected" if vn else "not configured",
        "database": db_status
    }


@app.post("/generate-sql")
async def generate_sql(question: Question):
    """
    Generate SQL from natural language question and execute it
    """
    if not vn:
        raise HTTPException(
            status_code=503,
            detail="Vanna AI service not initialized. Please configure GROQ_API_KEY."
        )
    
    try:
        print(f"📝 Processing question: {question.question}")
        
        # Generate SQL using Vanna
        sql = vn.generate_sql(question.question)
        
        if not sql:
            raise HTTPException(
                status_code=400,
                detail="Could not generate SQL from the question"
            )
        
        print(f"🔍 Generated SQL: {sql}")
        
        # Execute SQL and get results
        results_list = []
        answer = "Query executed successfully."
        
        try:
            conn = get_db_connection()
            if conn:
                df = pd.read_sql_query(sql, conn)
                results_list = df.to_dict('records')
                conn.close()
                
                # Generate natural language answer
                if len(results_list) > 0:
                    answer = vn.generate_answer(question.question, sql, df)
                else:
                    answer = "No results found for your query."
                    
                print(f"✅ Query successful: {len(results_list)} results")
            else:
                raise Exception("Database connection failed")
                
        except Exception as exec_error:
            print(f"❌ SQL execution error: {exec_error}")
            raise HTTPException(
                status_code=500,
                detail=f"SQL execution failed: {str(exec_error)}"
            )
        
        return {
            "sql": sql,
            "results": results_list,
            "answer": answer
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error generating SQL: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate SQL: {str(e)}"
        )


@app.post("/api/v0/generate_sql")
async def generate_sql_legacy(question: Question):
    """
    Legacy endpoint for backward compatibility
    """
    return await generate_sql(question)


@app.post("/train")
async def train_model(sql_query: SQLQuery):
    """
    Train Vanna on SQL queries to improve future generations
    """
    if not vn:
        raise HTTPException(
            status_code=503,
            detail="Vanna AI service not initialized"
        )
    
    try:
        vn.train(sql=sql_query.sql)
        return {"status": "success", "message": "Model trained on SQL query"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Training failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Vanna AI service on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
