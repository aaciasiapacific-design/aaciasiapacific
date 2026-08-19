export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Status = "draft" | "published" | "archived";

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: { id: string; email: string; display_name: string | null; role: string; role_id: string; is_active: boolean; created_at: string; updated_at: string };
        Insert: { id: string; email: string; display_name?: string | null; role?: string; role_id: string; is_active?: boolean; created_at?: string; updated_at?: string };
        Update: { email?: string; display_name?: string | null; role?: string; role_id?: string; is_active?: boolean; updated_at?: string };
        Relationships: [];
      };
      roles: {
        Row: { id: string; name: string; slug: string; description: string; is_system: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; slug: string; description?: string; is_system?: boolean; created_at?: string; updated_at?: string };
        Update: { name?: string; slug?: string; description?: string; is_system?: boolean; updated_at?: string };
        Relationships: [];
      };
      permissions: {
        Row: { key: string; module: string; action: string; description: string; sort_order: number };
        Insert: { key: string; module: string; action: string; description?: string; sort_order?: number };
        Update: { module?: string; action?: string; description?: string; sort_order?: number };
        Relationships: [];
      };
      role_permissions: {
        Row: { role_id: string; permission_key: string; created_at: string };
        Insert: { role_id: string; permission_key: string; created_at?: string };
        Update: { role_id?: string; permission_key?: string };
        Relationships: [{ foreignKeyName: "role_permissions_role_id_fkey"; columns: ["role_id"]; isOneToOne: false; referencedRelation: "roles"; referencedColumns: ["id"] }];
      };
      admin_audit_log: {
        Row: { id: number; actor_id: string | null; action: string; target_type: string; target_id: string | null; details: Json; created_at: string };
        Insert: { id?: number; actor_id?: string | null; action: string; target_type: string; target_id?: string | null; details?: Json; created_at?: string };
        Update: { action?: string; target_type?: string; target_id?: string | null; details?: Json };
        Relationships: [];
      };
      news: {
        Row: { id: string; slug: string; title: string; category: string; summary: string; content: string; cover_image_path: string | null; content_images: Json; author_name: string | null; status: Status; published_at: string | null; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; category?: string; summary?: string; content?: string; cover_image_path?: string | null; content_images?: Json; author_name?: string | null; status?: Status; published_at?: string | null; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { slug?: string; title?: string; category?: string; summary?: string; content?: string; cover_image_path?: string | null; content_images?: Json; author_name?: string | null; status?: Status; published_at?: string | null; updated_by?: string | null; updated_at?: string };
        Relationships: [];
      };
      events: {
        Row: { id: string; slug: string; title: string; summary: string; description: string; cover_image_path: string | null; starts_at: string; ends_at: string | null; timezone: string; is_all_day: boolean; mode: "online" | "onsite" | "hybrid"; location: string | null; registration_url: string | null; status: Status; published_at: string | null; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; summary?: string; description?: string; cover_image_path?: string | null; starts_at: string; ends_at?: string | null; timezone?: string; is_all_day?: boolean; mode?: "online" | "onsite" | "hybrid"; location?: string | null; registration_url?: string | null; status?: Status; published_at?: string | null; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { slug?: string; title?: string; summary?: string; description?: string; cover_image_path?: string | null; starts_at?: string; ends_at?: string | null; timezone?: string; is_all_day?: boolean; mode?: "online" | "onsite" | "hybrid"; location?: string | null; registration_url?: string | null; status?: Status; published_at?: string | null; updated_by?: string | null; updated_at?: string };
        Relationships: [];
      };
      courses: {
        Row: { id: string; slug: string; title: string; category: string | null; summary: string; description: string; cover_image_path: string | null; duration_text: string | null; format_text: string | null; fee_amount: number | null; fee_currency: string; registration_url: string | null; status: Status; published_at: string | null; sort_order: number; is_featured: boolean; accent_color: string; topics: string[]; early_bird_deadline: string | null; early_bird_discount_percent: number | null; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; category?: string | null; summary?: string; description?: string; cover_image_path?: string | null; duration_text?: string | null; format_text?: string | null; fee_amount?: number | null; fee_currency?: string; registration_url?: string | null; status?: Status; published_at?: string | null; sort_order?: number; is_featured?: boolean; accent_color?: string; topics?: string[]; early_bird_deadline?: string | null; early_bird_discount_percent?: number | null; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { slug?: string; title?: string; category?: string | null; summary?: string; description?: string; cover_image_path?: string | null; duration_text?: string | null; format_text?: string | null; fee_amount?: number | null; fee_currency?: string; registration_url?: string | null; status?: Status; published_at?: string | null; sort_order?: number; is_featured?: boolean; accent_color?: string; topics?: string[]; early_bird_deadline?: string | null; early_bird_discount_percent?: number | null; updated_by?: string | null; updated_at?: string };
        Relationships: [];
      };
      course_sessions: {
        Row: { id: string; course_id: string; starts_at: string; ends_at: string | null; timezone: string; capacity: number | null; registration_deadline: string | null; registration_url: string | null; registration_status: "open" | "closed" | "sold_out" | "cancelled"; status: Status; sort_order: number; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; course_id: string; starts_at: string; ends_at?: string | null; timezone?: string; capacity?: number | null; registration_deadline?: string | null; registration_url?: string | null; registration_status?: "open" | "closed" | "sold_out" | "cancelled"; status?: Status; sort_order?: number; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { starts_at?: string; ends_at?: string | null; timezone?: string; capacity?: number | null; registration_deadline?: string | null; registration_url?: string | null; registration_status?: "open" | "closed" | "sold_out" | "cancelled"; status?: Status; sort_order?: number; updated_by?: string | null; updated_at?: string };
        Relationships: [{ foreignKeyName: "course_sessions_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }];
      };
      accredited_organizations: {
        Row: { id: string; slug: string; organization_name: string; country_code: string; country_name: string; city: string | null; address: string | null; organization_type: string | null; programme: string; certificate_number: string | null; accreditation_scope: string | null; summary: string; issued_at: string | null; expires_at: string | null; accreditation_status: "active" | "suspended" | "expired" | "withdrawn"; logo_path: string | null; website_url: string | null; status: Status; published_at: string | null; sort_order: number; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; organization_name: string; country_code: string; country_name: string; city?: string | null; address?: string | null; organization_type?: string | null; programme: string; certificate_number?: string | null; accreditation_scope?: string | null; summary?: string; issued_at?: string | null; expires_at?: string | null; accreditation_status?: "active" | "suspended" | "expired" | "withdrawn"; logo_path?: string | null; website_url?: string | null; status?: Status; published_at?: string | null; sort_order?: number; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { slug?: string; organization_name?: string; country_code?: string; country_name?: string; city?: string | null; address?: string | null; organization_type?: string | null; programme?: string; certificate_number?: string | null; accreditation_scope?: string | null; summary?: string; issued_at?: string | null; expires_at?: string | null; accreditation_status?: "active" | "suspended" | "expired" | "withdrawn"; logo_path?: string | null; website_url?: string | null; status?: Status; published_at?: string | null; sort_order?: number; updated_by?: string | null; updated_at?: string };
        Relationships: [];
      };
      people: {
        Row: { id: string; full_name: string; credentials: string | null; photo_path: string | null; biography: string | null; status: Status; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; full_name: string; credentials?: string | null; photo_path?: string | null; biography?: string | null; status?: Status; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { full_name?: string; credentials?: string | null; photo_path?: string | null; biography?: string | null; status?: Status; updated_by?: string | null; updated_at?: string };
        Relationships: [];
      };
      person_assignments: {
        Row: { id: string; person_id: string; section: "asia_office" | "country_director" | "regional_advisory_board" | "surveyor"; role_title: string | null; organization_name: string | null; member_code: string | null; surveyor_specialty: "clinical" | "governance" | "pe_specialist" | null; is_leadership: boolean; sort_order: number; status: Status; created_by: string | null; updated_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; person_id: string; section: "asia_office" | "country_director" | "regional_advisory_board" | "surveyor"; role_title?: string | null; organization_name?: string | null; member_code?: string | null; surveyor_specialty?: "clinical" | "governance" | "pe_specialist" | null; is_leadership?: boolean; sort_order?: number; status?: Status; created_by?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string };
        Update: { section?: "asia_office" | "country_director" | "regional_advisory_board" | "surveyor"; role_title?: string | null; organization_name?: string | null; member_code?: string | null; surveyor_specialty?: "clinical" | "governance" | "pe_specialist" | null; is_leadership?: boolean; sort_order?: number; status?: Status; updated_by?: string | null; updated_at?: string };
        Relationships: [{ foreignKeyName: "person_assignments_person_id_fkey"; columns: ["person_id"]; isOneToOne: false; referencedRelation: "people"; referencedColumns: ["id"] }];
      };
      person_assignment_countries: {
        Row: { id: string; assignment_id: string; country_code: string; country_name: string; sort_order: number; created_at: string };
        Insert: { id?: string; assignment_id: string; country_code: string; country_name: string; sort_order?: number; created_at?: string };
        Update: { country_code?: string; country_name?: string; sort_order?: number };
        Relationships: [{ foreignKeyName: "person_assignment_countries_assignment_id_fkey"; columns: ["assignment_id"]; isOneToOne: false; referencedRelation: "person_assignments"; referencedColumns: ["id"] }];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_cms_user: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_cms_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      has_permission: { Args: { requested_permission: string }; Returns: boolean };
      get_my_permissions: { Args: Record<PropertyKey, never>; Returns: string[] };
      admin_update_user: { Args: { target_user_id: string; new_display_name: string; new_role_id: string; new_is_active: boolean }; Returns: undefined };
      admin_save_role: { Args: { target_role_id: string | null; new_name: string; new_slug: string; new_description: string; permission_keys: string[] }; Returns: string };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
