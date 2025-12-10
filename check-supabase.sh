#!/bin/bash

# Script kiểm tra Supabase Realtime setup

echo "🔍 Checking Supabase Configuration..."
echo ""

# Check .env file
if [ -f .env ]; then
  echo "✅ .env file exists"
  
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY found in .env"
    KEY_LENGTH=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env | cut -d'=' -f2 | tr -d '"' | wc -c)
    echo "   Key length: $KEY_LENGTH characters"
  else
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env"
  fi
  
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env; then
    SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env | cut -d'=' -f2 | tr -d '"')
    echo "✅ NEXT_PUBLIC_SUPABASE_URL found: $SUPABASE_URL"
  else
    echo "❌ NEXT_PUBLIC_SUPABASE_URL missing in .env"
  fi
else
  echo "❌ .env file not found"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Open debug page: http://localhost:3000/debug-realtime"
echo "   This will test both 'Message' and 'message' table names"
echo ""
echo "2. Check Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/vehatkcukaloprvqcejz/database/replication"
echo ""
echo "3. Enable Realtime for Message table:"
echo "   - Find 'Message' or 'message' table in the list"
echo "   - Toggle the switch to enable Realtime"
echo "   - Save changes"
echo ""
echo "4. Run SQL check:"
echo "   - Open: https://supabase.com/dashboard/project/vehatkcukaloprvqcejz/sql"
echo "   - Paste contents from: check-realtime.sql"
echo "   - Run the query"
echo ""
echo "5. Test the chat app and check Console logs"
echo ""
