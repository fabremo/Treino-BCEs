
import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Substitua os valores abaixo pelas suas chaves reais do painel do Supabase
// A URL deve começar com https:// e terminar com .supabase.co
const supabaseUrl = 'https://yrtneanrmlijwgckiyzd.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydG5lYW5ybWxpandnY2tpeXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjI3NzAsImV4cCI6MjA4MTYzODc3MH0.I3dZICO7VhDJvK731KQ-UKYtBJGQVZ81aQnEqVvRSXo';

export const supabase = createClient(supabaseUrl, supabaseKey);
