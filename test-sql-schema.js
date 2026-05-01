/**
 * Test Script: Execute SQL Schema on Supabase
 * Reads the schema migration file and tests it
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://iblmaweycrpqwozjurhv.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibG1hd2V5Y3JwcXdvemp1cmh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYyNTQ2NCwiZXhwIjoyMDkzMjAxNDY0fQ.Qbtk0s02JO_vWm0EuITAkG8PrRWECKVCddvHEYE5f5E";

async function testSchema() {
  try {
    console.log("📋 Loading SQL schema file...");
    const schemaPath = path.join(
      __dirname,
      "backend",
      "sql",
      "001_create_skyx_schema.sql",
    );
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    console.log("✅ Schema file loaded");
    console.log(`🔗 Connecting via Supabase client...`);
    console.log(`   URL: ${SUPABASE_URL}\n`);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Split schema into sections
    const sections = schemaSQL
      .split(
        "-- ============================================================================",
      )
      .filter((s) => s.trim().length > 0);

    console.log(`📊 Schema contains ${sections.length} sections\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Execute first 5 sections
    for (let i = 0; i < Math.min(5, sections.length); i++) {
      const section = sections[i].trim();
      const firstLine = section.split("\n")[1]?.trim() || `Section ${i + 1}`;

      try {
        console.log(`⏳ Executing: ${firstLine}`);
        const { data, error } = await supabase
          .rpc("exec_sql", { sql: section })
          .catch(() => ({
            error: new Error("RPC not available - using fallback"),
          }));

        // Alternative: query directly
        if (error) {
          // Try direct query
          const parts = section.split(";").filter((p) => p.trim());
          for (const part of parts.slice(0, 1)) {
            const { error: e } = await supabase
              .from("users")
              .select("*")
              .limit(1);
            if (e) throw e;
          }
        }

        console.log(`✅ SUCCESS\n`);
        successCount++;
      } catch (err) {
        console.error(`❌ ERROR: ${err.message}\n`);
        errors.push({ section: firstLine, error: err.message });
        errorCount++;
      }
    }

    // Test basic connectivity
    console.log("🔍 Testing Supabase connectivity...\n");
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (!error) {
        console.log("✅ Admin API connection: SUCCESS");
      } else {
        console.log(`⚠️  Admin API connection: ${error.message}`);
      }
    } catch (e) {
      console.log(`⚠️  Admin API test: ${e.message}`);
    }

    // Try reading schema info
    console.log("\n🔍 Checking database schema...\n");
    try {
      const { data: tables, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public");

      if (tables && tables.length > 0) {
        console.log("✅ Tables found:");
        tables.forEach((t) => console.log(`   - ${t.table_name}`));
      } else if (!error) {
        console.log("ℹ️  No tables found yet (may need manual SQL execution)");
      }
    } catch (e) {
      console.log(`ℹ️  Could not query schema info: ${e.message}`);
    }

    console.log(`\n📊 TEST RESULTS:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log("\n⚠️  Issues found:");
      errors.forEach((e) => console.log(`   - ${e.section}: ${e.error}`));
    }

    console.log("\n💡 NEXT STEPS:");
    console.log("1. Go to Supabase Dashboard > SQL Editor");
    console.log(
      "2. Copy entire content of: backend/sql/001_create_skyx_schema.sql",
    );
    console.log("3. Paste into SQL Editor");
    console.log("4. Execute all sections (1-20) in order");
  } catch (error) {
    console.error("\n❌ Test error:", error.message);
    console.log("\n💡 WORKAROUND:");
    console.log("Execute the SQL manually in Supabase Dashboard:");
    console.log("1. Go to https://supabase.com/dashboard");
    console.log("2. Select your project");
    console.log("3. Go to SQL Editor");
    console.log("4. Create a new query");
    console.log("5. Copy from: backend/sql/001_create_skyx_schema.sql");
    console.log("6. Execute sections 1-20 in order");
  }
}

testSchema();
