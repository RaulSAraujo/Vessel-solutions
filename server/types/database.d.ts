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
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          phone_optional: string | null
          user_id: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          phone_optional?: string | null
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          phone_optional?: string | null
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      client_addresses: {
        Row: {
          zip_code: string
          city: string
          state: string
          neighborhood: string
          street: string
          number: string
          client_id: string
          additional_info: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          zip_code: string
          city: string
          state: string
          neighborhood: string
          street: string
          number: string
          client_id?: string
          additional_info?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          zip_code?: string
          city?: string
          state?: string
          neighborhood?: string
          street?: string
          number?: string
          client_id?: string
          additional_info?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      drinks: {
        Row: {
          id: string
          name: string
          type: boolean
          user_id: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: boolean
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: boolean
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      drink_ingredients: {
        Row: {
          id: string
          drink_id: string
          ingredient_id: string
          quantity: number
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          drink_id: string
          ingredient_id: string
          quantity: number
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          drink_id?: string
          ingredient_id?: string
          quantity?: number
          updated_at?: string | null
          created_at?: string | null
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
        ]
      }
      event_drinks: {
        Row: {
          id: string
          drink_id: string
          event_id: string
          estimated_quantity: number
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          drink_id: string
          event_id: string
          estimated_quantity: number
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          drink_id?: string
          event_id?: string
          estimated_quantity?: number
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_drinks_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_drinks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          id: string
          client_id: string
          location: string
          start_time: string
          end_time: string
          guest_count: number
          distance: number
          audience_profile: string
          status: string | null
          user_id: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          location: string
          start_time: Date
          end_time: Date
          guest_count: number
          distance: number
          audience_profile: string
          status: string | null
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          location?: string
          start_time?: Date
          end_time?: Date
          guest_count?: number
          distance?: number
          audience_profile?: string
          status?: string | null
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
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
          id: string
          name: string
          unit_id: string
          user_id: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          unit_id: string
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          unit_id?: string
          user_id?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          id: string
          name: string
          abbreviation: string
        }
        Insert: {
          id?: string
          name: string
          abbreviation: string
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string | null
          email: string | null
          observation: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          observation?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          observation?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quotations: {
        Row: {
          id: string
          supplier_id: string
          ingredient_id: string
          purchase_price: number
          quotation_date: string | null
          user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          supplier_id: string
          ingredient_id: string
          purchase_price: number
          quotation_date?: string | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          supplier_id?: string
          ingredient_id?: string
          purchase_price?: number
          quotation_date?: string | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
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
            foreignKeyName: "quotations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_list_items: {
        Row: {
          batch_unit: string | null
          created_at: string | null
          id: string
          ingredient_id: string
          purchase_list_id: string
          required_quantity: number
          required_unit: string
          suggested_batch_size: number | null
          suggested_total_batches: number | null
          updated_at: string | null
        }
        Insert: {
          batch_unit?: string | null
          created_at?: string | null
          id?: string
          ingredient_id: string
          purchase_list_id: string
          required_quantity: number
          required_unit: string
          suggested_batch_size?: number | null
          suggested_total_batches?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_unit?: string | null
          created_at?: string | null
          id?: string
          ingredient_id?: string
          purchase_list_id?: string
          required_quantity?: number
          required_unit?: string
          suggested_batch_size?: number | null
          suggested_total_batches?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_list_items_purchase_list_id_fkey"
            columns: ["purchase_list_id"]
            isOneToOne: false
            referencedRelation: "purchase_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_lists: {
        Row: {
          created_at: string | null
          event_id: string | null
          generation_date: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          generation_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          generation_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_lists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string | null
          drink_id: string
          id: string
          ingredient_id: string
          recipe_unit: string
          required_quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_id: string
          id?: string
          ingredient_id: string
          recipe_unit: string
          required_quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_id?: string
          id?: string
          ingredient_id?: string
          recipe_unit?: string
          required_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bulk_update_ingredients: {
        Args: {
          updates: Json;
        };
        Returns: Tables["drink_ingredients"][];
      };
      insertion_client_and_address: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone: string;
          p_phone_optional?: string | null;
          p_user_id: string;
          p_zip_code: string;
          p_city: string;
          p_state: string;
          p_neighborhood: string;
          p_street: string;
          p_number: string;
          p_additional_info?: string | null;
        };
        Returns: {
          client: Tables["clients"];
          address: Tables["client_addresses"];
        };
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
