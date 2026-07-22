from supabase import create_client
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xcwsnrfzasdkzixkkevr.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_T3VygctH4yGpX6Dyruo_3w_z3nKe6Ly")

supabase = create_client(
    SUPABASE_URL, # type: ignore 
    SUPABASE_KEY
)