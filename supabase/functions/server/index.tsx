import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-74a5ff22/health", (c) => {
  return c.json({ status: "ok" });
});

// Early access signup endpoint
app.post("/make-server-74a5ff22/early-access", async (c) => {
  try {
    const body = await c.req.json();
    const { email, city, source } = body;

    // Validate required fields
    if (!email || !city) {
      return c.json({ error: "Email and city are required" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS early_access (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          city TEXT NOT NULL,
          source TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }).catch(() => ({ error: null })); // Ignore if exec_sql doesn't exist

    // Insert the early access request
    const { data, error } = await supabase
      .from('early_access')
      .insert([
        {
          email,
          city,
          source: source || 'homepage_rebellion',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting early access request:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Successfully added to early access list',
      data 
    });

  } catch (error) {
    console.error('Error processing early access request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// MythOS Pro early access signup endpoint
app.post("/make-server-74a5ff22/mythos-pro-early-access", async (c) => {
  try {
    const body = await c.req.json();
    const { email, business_name, city, source } = body;

    // Validate required fields
    if (!email || !city) {
      return c.json({ error: "Email and city are required" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS mythos_pro_early_access (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          business_name TEXT,
          city TEXT NOT NULL,
          source TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }).catch(() => ({ error: null })); // Ignore if exec_sql doesn't exist

    // Insert the early access request
    const { data, error } = await supabase
      .from('mythos_pro_early_access')
      .insert([
        {
          email,
          business_name: business_name || null,
          city,
          source: source || 'homepage_pro_card',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting MythOS Pro early access request:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Successfully added to MythOS Pro early access list',
      data 
    });

  } catch (error) {
    console.error('Error processing MythOS Pro early access request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// Mylo Personal early access signup endpoint
app.post("/make-server-74a5ff22/mylo-personal-early-access", async (c) => {
  try {
    const body = await c.req.json();
    const { email, city, source } = body;

    // Validate required fields
    if (!email || !city) {
      return c.json({ error: "Email and city are required" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS mylo_personal_early_access (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          city TEXT NOT NULL,
          source TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }).catch(() => ({ error: null })); // Ignore if exec_sql doesn't exist

    // Insert the early access request
    const { data, error } = await supabase
      .from('mylo_personal_early_access')
      .insert([
        {
          email,
          city,
          source: source || 'homepage_mylo_personal_card',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting Mylo Personal early access request:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Successfully added to Mylo Personal early access list',
      data 
    });

  } catch (error) {
    console.error('Error processing Mylo Personal early access request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// Investor lead submission endpoint
app.post("/make-server-74a5ff22/investor-lead", async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, organization, investor_type, check_size, notes } = body;

    // Validate required fields
    if (!full_name || !email) {
      return c.json({ error: "Full name and email are required" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert the investor lead
    const { data, error } = await supabase
      .from('investor_leads')
      .insert([
        {
          full_name,
          email,
          organization: organization || null,
          investor_type: investor_type || null,
          check_size: check_size || null,
          notes: notes || null,
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting investor lead:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Deck sent successfully',
      data 
    });

  } catch (error) {
    console.error('Error processing investor lead:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// BID/Chamber partner endpoint
app.post("/make-server-74a5ff22/bid-chamber-partner", async (c) => {
  try {
    const body = await c.req.json();
    const { organization_name, organization_type, contact_name, contact_email, city, state, contact_phone, zip_code, website, number_of_member_businesses, notes } = body;

    // Validate required fields
    if (!organization_name || !organization_type || !contact_name || !contact_email || !city || !state) {
      return c.json({ error: "All required fields must be filled" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert the partner request
    const { data, error } = await supabase
      .from('bid_chamber_partners')
      .insert([
        {
          organization_name,
          organization_type,
          contact_name,
          contact_email,
          city,
          state,
          contact_phone: contact_phone || null,
          zip_code: zip_code || null,
          website: website || null,
          number_of_member_businesses: number_of_member_businesses || null,
          notes: notes || null,
          partnership_status: 'pending',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting BID/Chamber partner:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Partnership request submitted successfully',
      data 
    });

  } catch (error) {
    console.error('Error processing BID/Chamber partner request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// Early adopter business endpoint
app.post("/make-server-74a5ff22/early-adopter-business", async (c) => {
  try {
    const body = await c.req.json();
    const { business_name, owner_name, owner_email, city, state, business_type, owner_phone, business_address, zip_code, website, social_media_handles, referred_by, feedback_notes } = body;

    // Validate required fields
    if (!business_name || !owner_name || !owner_email || !city || !state) {
      return c.json({ error: "All required fields must be filled" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(owner_email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert the early adopter business
    const { data, error } = await supabase
      .from('early_adopter_businesses')
      .insert([
        {
          business_name,
          owner_name,
          owner_email,
          city,
          state,
          business_type: business_type || null,
          owner_phone: owner_phone || null,
          business_address: business_address || null,
          zip_code: zip_code || null,
          website: website || null,
          social_media_handles: social_media_handles || null,
          referred_by: referred_by || null,
          feedback_notes: feedback_notes || null,
          partnership_status: 'pending',
          network_launch_city: 'Dallas / Fort Worth',
          myth_credits_awarded: 0,
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting early adopter business:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Welcome to the founding partners!',
      data 
    });

  } catch (error) {
    console.error('Error processing early adopter business request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// Creator affiliate endpoint
app.post("/make-server-74a5ff22/creator-affiliate", async (c) => {
  try {
    const body = await c.req.json();
    const { creator_name, email, platform, handle_username, phone, follower_count, audience_description, content_focus, city, state, notes } = body;

    // Validate required fields
    if (!creator_name || !email || !platform || !handle_username) {
      return c.json({ error: "All required fields must be filled" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert the creator affiliate
    const { data, error } = await supabase
      .from('creator_affiliates')
      .insert([
        {
          creator_name,
          email,
          platform,
          handle_username,
          phone: phone || null,
          follower_count: follower_count || null,
          audience_description: audience_description || null,
          content_focus: content_focus || null,
          city: city || null,
          state: state || null,
          notes: notes || null,
          affiliate_status: 'pending',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting creator affiliate:', error);
      return c.json({ error: 'Failed to save your request. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Affiliate application submitted successfully',
      data 
    });

  } catch (error) {
    console.error('Error processing creator affiliate request:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

// Job application endpoint
app.post("/make-server-74a5ff22/job-application", async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, position_applied_for, why_mythos, phone, location_city, location_state, portfolio_url, linkedin_url, experience_summary, availability } = body;

    // Validate required fields
    if (!full_name || !email || !position_applied_for || !why_mythos) {
      return c.json({ error: "All required fields must be filled" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert the job application
    const { data, error } = await supabase
      .from('employee_applications')
      .insert([
        {
          full_name,
          email,
          position_applied_for,
          why_mythos,
          phone: phone || null,
          location_city: location_city || null,
          location_state: location_state || null,
          portfolio_url: portfolio_url || null,
          linkedin_url: linkedin_url || null,
          experience_summary: experience_summary || null,
          availability: availability || null,
          application_status: 'pending',
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting job application:', error);
      return c.json({ error: 'Failed to save your application. Please try again.' }, 500);
    }

    return c.json({ 
      success: true,
      message: 'Application submitted successfully',
      data 
    });

  } catch (error) {
    console.error('Error processing job application:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, 500);
  }
});

Deno.serve(app.fetch);