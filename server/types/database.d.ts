export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      client_addresses: {
        Row: {
          additional_info: string | null
          city: string
          client_id: string
          created_at: string | null
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          additional_info?: string | null
          city: string
          client_id: string
          created_at?: string | null
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          additional_info?: string | null
          city?: string
          client_id?: string
          created_at?: string | null
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          phone_optional: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          phone_optional?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          phone_optional?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      drink_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      drink_ingredients: {
        Row: {
          created_at: string | null
          drink_id: string
          ingredient_id: string
          quantity: number
          unit_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_id: string
          ingredient_id: string
          quantity: number
          unit_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_id?: string
          ingredient_id?: string
          quantity?: number
          unit_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drink_ingredients_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drink_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drink_ingredients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      drinks: {
        Row: {
          calculated_cost: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          profit_margin_percentage: number | null
          selling_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calculated_cost?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          profit_margin_percentage?: number | null
          selling_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calculated_cost?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          profit_margin_percentage?: number | null
          selling_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drinks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "drink_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      event_drinks: {
        Row: {
          created_at: string | null
          drink_calculated_cost: number | null
          drink_category_name: string | null
          drink_description: string | null
          drink_image_url: string | null
          drink_name: string | null
          drink_percentage: number
          drink_profit_margin_percentage: number | null
          drink_selling_price: number | null
          event_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_calculated_cost?: number | null
          drink_category_name?: string | null
          drink_description?: string | null
          drink_image_url?: string | null
          drink_name?: string | null
          drink_percentage?: number
          drink_profit_margin_percentage?: number | null
          drink_selling_price?: number | null
          event_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_calculated_cost?: number | null
          drink_category_name?: string | null
          drink_description?: string | null
          drink_image_url?: string | null
          drink_name?: string | null
          drink_percentage?: number
          drink_profit_margin_percentage?: number | null
          drink_selling_price?: number | null
          event_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_drinks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_quotation_drinks: {
        Row: {
          created_at: string | null
          drink_calculated_cost: number | null
          drink_category_name: string | null
          drink_description: string | null
          drink_image_url: string | null
          drink_name: string | null
          drink_percentage: number
          drink_profit_margin_percentage: number | null
          drink_selling_price: number | null
          event_quotation_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_calculated_cost?: number | null
          drink_category_name?: string | null
          drink_description?: string | null
          drink_image_url?: string | null
          drink_name?: string | null
          drink_percentage?: number
          drink_profit_margin_percentage?: number | null
          drink_selling_price?: number | null
          event_quotation_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_calculated_cost?: number | null
          drink_category_name?: string | null
          drink_description?: string | null
          drink_image_url?: string | null
          drink_name?: string | null
          drink_percentage?: number
          drink_profit_margin_percentage?: number | null
          drink_selling_price?: number | null
          event_quotation_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_quotation_drinks_event_quotation_id_fkey"
            columns: ["event_quotation_id"]
            isOneToOne: false
            referencedRelation: "event_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_quotations: {
        Row: {
          audience_profile: string
          bartender_hourly_rate: number | null
          client_email: string | null
          client_name: string
          client_phone: string
          created_at: string | null
          distance: number
          end_time: string
          estimated_total_drinks: number | null
          fuel_cost_per_km: number | null
          guest_count: number
          helper_hourly_rate: number | null
          id: string
          location: string
          notes: string | null
          num_bartenders: number | null
          num_helpers: number | null
          profit_margin: number | null
          start_time: string
          status: string | null
          total_cost: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audience_profile: string
          bartender_hourly_rate?: number | null
          client_email?: string | null
          client_name: string
          client_phone: string
          created_at?: string | null
          distance: number
          end_time: string
          estimated_total_drinks?: number | null
          fuel_cost_per_km?: number | null
          guest_count: number
          helper_hourly_rate?: number | null
          id?: string
          location: string
          notes?: string | null
          num_bartenders?: number | null
          num_helpers?: number | null
          profit_margin?: number | null
          start_time: string
          status?: string | null
          total_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audience_profile?: string
          bartender_hourly_rate?: number | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string | null
          distance?: number
          end_time?: string
          estimated_total_drinks?: number | null
          fuel_cost_per_km?: number | null
          guest_count?: number
          helper_hourly_rate?: number | null
          id?: string
          location?: string
          notes?: string | null
          num_bartenders?: number | null
          num_helpers?: number | null
          profit_margin?: number | null
          start_time?: string
          status?: string | null
          total_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          audience_profile: string
          bartender_hourly_rate: number | null
          client_id: string
          created_at: string | null
          distance: number
          end_time: string
          estimated_total_drinks: number | null
          fuel_cost_per_km: number | null
          guest_count: number
          helper_hourly_rate: number | null
          id: string
          location: string
          notes: string | null
          num_bartenders: number | null
          num_helpers: number | null
          profit_margin: number | null
          start_time: string
          status: string | null
          total_cost: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audience_profile: string
          bartender_hourly_rate?: number | null
          client_id: string
          created_at?: string | null
          distance: number
          end_time: string
          estimated_total_drinks?: number | null
          fuel_cost_per_km?: number | null
          guest_count: number
          helper_hourly_rate?: number | null
          id?: string
          location: string
          notes?: string | null
          num_bartenders?: number | null
          num_helpers?: number | null
          profit_margin?: number | null
          start_time: string
          status?: string | null
          total_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audience_profile?: string
          bartender_hourly_rate?: number | null
          client_id?: string
          created_at?: string | null
          distance?: number
          end_time?: string
          estimated_total_drinks?: number | null
          fuel_cost_per_km?: number | null
          guest_count?: number
          helper_hourly_rate?: number | null
          id?: string
          location?: string
          notes?: string | null
          num_bartenders?: number | null
          num_helpers?: number | null
          profit_margin?: number | null
          start_time?: string
          status?: string | null
          total_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string | null
          current_quotation_id: string | null
          id: string
          name: string
          real_cost_per_base_unit: number | null
          unit_id: number
          unit_volume_ml: number | null
          unit_weight_g: number | null
          updated_at: string | null
          user_id: string | null
          wastage_percentage: number
        }
        Insert: {
          created_at?: string | null
          current_quotation_id?: string | null
          id?: string
          name: string
          real_cost_per_base_unit?: number | null
          unit_id: number
          unit_volume_ml?: number | null
          unit_weight_g?: number | null
          updated_at?: string | null
          user_id?: string | null
          wastage_percentage?: number
        }
        Update: {
          created_at?: string | null
          current_quotation_id?: string | null
          id?: string
          name?: string
          real_cost_per_base_unit?: number | null
          unit_id?: number
          unit_volume_ml?: number | null
          unit_weight_g?: number | null
          updated_at?: string | null
          user_id?: string | null
          wastage_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_current_quotation_id_fkey"
            columns: ["current_quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          purchase_price: number
          purchase_quantity: number
          purchase_unit_id: number
          quotation_date: string
          supplier_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          purchase_price: number
          purchase_quantity?: number
          purchase_unit_id: number
          quotation_date?: string
          supplier_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          purchase_price?: number
          purchase_quantity?: number
          purchase_unit_id?: number
          quotation_date?: string
          supplier_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_purchase_unit_id_fkey"
            columns: ["purchase_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          observation: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          observation?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          observation?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      purchase_list: {
        Row: {
          created_at: string | null
          estimated_cost: number | null
          event_id: string
          id: string
          ingredient_id: string
          notes: string | null
          quantity_needed: number
          status: string | null
          unit_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_cost?: number | null
          event_id: string
          id?: string
          ingredient_id: string
          notes?: string | null
          quantity_needed: number
          status?: string | null
          unit_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_cost?: number | null
          event_id?: string
          id?: string
          ingredient_id?: string
          notes?: string | null
          quantity_needed?: number
          status?: string | null
          unit_id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_list_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_list_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_list_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          abbreviation: string
          id: number
          name: string
        }
        Insert: {
          abbreviation: string
          id?: number
          name: string
        }
        Update: {
          abbreviation?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insertion_client_and_address: {
        Args: {
          p_additional_info: string
          p_city: string
          p_email: string
          p_name: string
          p_neighborhood: string
          p_number: string
          p_phone: string
          p_phone_optional: string
          p_state: string
          p_street: string
          p_user_id: string
          p_zip_code: string
        }
        Returns: {
          client: Tables["clients"]
          address: Tables["client_addresses"]
        }
      }
      update_client_and_address: {
        Args: {
          p_additional_info: string
          p_city: string
          p_client_id: string
          p_email: string
          p_name: string
          p_neighborhood: string
          p_number: string
          p_phone: string
          p_phone_optional: string
          p_state: string
          p_street: string
          p_zip_code: string
        }
        Returns: {
          client: Tables["clients"]
          address: Tables["client_addresses"]
        }
      }
      upsert_multiple_drink_ingredients: {
        Args: { p_drink_id: string; p_ingredients: Json[] }
        Returns: {
          created_at: string | null
          drink_id: string
          ingredient_id: string
          quantity: number
          unit_id: number | null
          updated_at: string | null
        }[]
      }
      upsert_multiple_event_drinks: {
        Args: { p_event_id: string; p_drinks: Json[] }
        Returns: {
          created_at: string
          drink_calculated_cost: number
          drink_category_name: string
          drink_description: string
          drink_image_url: string
          drink_name: string
          drink_percentage: number
          drink_profit_margin_percentage: number
          drink_selling_price: number
          event_id: string
          id: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const