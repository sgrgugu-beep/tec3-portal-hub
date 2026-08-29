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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      albumes: {
        Row: {
          categoria_slug: string
          created_at: string
          descripcion: string
          fecha: string
          id: string
          publicado: boolean
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria_slug?: string
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          publicado?: boolean
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria_slug?: string
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          publicado?: boolean
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      auditoria: {
        Row: {
          accion: string
          created_at: string
          detalle: string
          entidad: string
          entidad_id: string | null
          id: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          detalle?: string
          entidad: string
          entidad_id?: string | null
          id?: string
          user_email?: string
          user_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          detalle?: string
          entidad?: string
          entidad_id?: string | null
          id?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      autoridades: {
        Row: {
          cargo: string
          created_at: string
          foto_url: string | null
          id: string
          nombre: string
          orden: number
          updated_at: string
        }
        Insert: {
          cargo?: string
          created_at?: string
          foto_url?: string | null
          id?: string
          nombre: string
          orden?: number
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          foto_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
      avisos: {
        Row: {
          categoria_slug: string
          created_at: string
          cuerpo: string
          destacado: boolean
          fecha: string
          id: string
          imagen_alt: string | null
          imagen_url: string | null
          publicado: boolean
          resumen: string
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria_slug?: string
          created_at?: string
          cuerpo?: string
          destacado?: boolean
          fecha?: string
          id?: string
          imagen_alt?: string | null
          imagen_url?: string | null
          publicado?: boolean
          resumen?: string
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria_slug?: string
          created_at?: string
          cuerpo?: string
          destacado?: boolean
          fecha?: string
          id?: string
          imagen_alt?: string | null
          imagen_url?: string | null
          publicado?: boolean
          resumen?: string
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      capacitaciones: {
        Row: {
          area_slug: string
          created_at: string
          descripcion: string
          destinatarios: string
          dictada_por: string
          duracion: string | null
          estado: string
          fecha_inicio: string | null
          id: string
          modalidad: string
          publicado: boolean
          titulo: string
          updated_at: string
        }
        Insert: {
          area_slug?: string
          created_at?: string
          descripcion?: string
          destinatarios?: string
          dictada_por?: string
          duracion?: string | null
          estado?: string
          fecha_inicio?: string | null
          id?: string
          modalidad?: string
          publicado?: boolean
          titulo: string
          updated_at?: string
        }
        Update: {
          area_slug?: string
          created_at?: string
          descripcion?: string
          destinatarios?: string
          dictada_por?: string
          duracion?: string | null
          estado?: string
          fecha_inicio?: string | null
          id?: string
          modalidad?: string
          publicado?: boolean
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          color: string
          created_at: string
          id: string
          nombre: string
          orden: number
          slug: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          nombre: string
          orden?: number
          slug: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          nombre?: string
          orden?: number
          slug?: string
          tipo?: Database["public"]["Enums"]["tipo_categoria"]
          updated_at?: string
        }
        Relationships: []
      }
      configuracion_sitio: {
        Row: {
          clave: string
          descripcion: string
          grupo: string
          updated_at: string
          valor: string
        }
        Insert: {
          clave: string
          descripcion?: string
          grupo?: string
          updated_at?: string
          valor?: string
        }
        Update: {
          clave?: string
          descripcion?: string
          grupo?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      especialidades: {
        Row: {
          created_at: string
          descripcion: string
          id: string
          nombre: string
          nombre_corto: string
          orden: number
          salida_laboral: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string
          id?: string
          nombre: string
          nombre_corto?: string
          orden?: number
          salida_laboral?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          id?: string
          nombre?: string
          nombre_corto?: string
          orden?: number
          salida_laboral?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string
          descripcion: string
          fecha: string
          hora_fin: string | null
          hora_inicio: string | null
          id: string
          lugar: string
          publicado: boolean
          tipo_slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string
          fecha: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          lugar?: string
          publicado?: boolean
          tipo_slug?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          lugar?: string
          publicado?: boolean
          tipo_slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      fotos: {
        Row: {
          album_id: string
          alt: string
          created_at: string
          id: string
          miniatura_url: string | null
          orden: number
          updated_at: string
          url: string
        }
        Insert: {
          album_id: string
          alt?: string
          created_at?: string
          id?: string
          miniatura_url?: string | null
          orden?: number
          updated_at?: string
          url: string
        }
        Update: {
          album_id?: string
          alt?: string
          created_at?: string
          id?: string
          miniatura_url?: string | null
          orden?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albumes"
            referencedColumns: ["id"]
          },
        ]
      }
      integrantes_centro: {
        Row: {
          cargo: string
          created_at: string
          curso: string | null
          foto_url: string | null
          id: string
          nombre: string
          orden: number
          updated_at: string
        }
        Insert: {
          cargo?: string
          created_at?: string
          curso?: string | null
          foto_url?: string | null
          id?: string
          nombre: string
          orden?: number
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          curso?: string | null
          foto_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
      invitaciones: {
        Row: {
          codigo: string
          creada_por: string | null
          created_at: string
          email: string
          expira_en: string
          id: string
          revocada: boolean
          role: Database["public"]["Enums"]["app_role"]
          secciones: Database["public"]["Enums"]["seccion_sitio"][]
          usada_en: string | null
          usada_por: string | null
        }
        Insert: {
          codigo: string
          creada_por?: string | null
          created_at?: string
          email: string
          expira_en?: string
          id?: string
          revocada?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          secciones?: Database["public"]["Enums"]["seccion_sitio"][]
          usada_en?: string | null
          usada_por?: string | null
        }
        Update: {
          codigo?: string
          creada_por?: string | null
          created_at?: string
          email?: string
          expira_en?: string
          id?: string
          revocada?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          secciones?: Database["public"]["Enums"]["seccion_sitio"][]
          usada_en?: string | null
          usada_por?: string | null
        }
        Relationships: []
      }
      materias: {
        Row: {
          anio: number
          carga_horaria: string | null
          ciclo: string
          created_at: string
          descripcion: string
          especialidad_slug: string | null
          id: string
          nombre: string
          orden: number
          updated_at: string
        }
        Insert: {
          anio: number
          carga_horaria?: string | null
          ciclo?: string
          created_at?: string
          descripcion?: string
          especialidad_slug?: string | null
          id?: string
          nombre: string
          orden?: number
          updated_at?: string
        }
        Update: {
          anio?: number
          carga_horaria?: string | null
          ciclo?: string
          created_at?: string
          descripcion?: string
          especialidad_slug?: string | null
          id?: string
          nombre?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
      mensajes_contacto: {
        Row: {
          asunto: string
          created_at: string
          email: string
          id: string
          leido: boolean
          mensaje: string
          nombre: string
          telefono: string | null
        }
        Insert: {
          asunto?: string
          created_at?: string
          email: string
          id?: string
          leido?: boolean
          mensaje: string
          nombre: string
          telefono?: string | null
        }
        Update: {
          asunto?: string
          created_at?: string
          email?: string
          id?: string
          leido?: boolean
          mensaje?: string
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          activo: boolean
          created_at: string
          email: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email: string
          id: string
          nombre?: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      permisos_seccion: {
        Row: {
          created_at: string
          id: string
          seccion: Database["public"]["Enums"]["seccion_sitio"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          seccion: Database["public"]["Enums"]["seccion_sitio"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          seccion?: Database["public"]["Enums"]["seccion_sitio"]
          user_id?: string
        }
        Relationships: []
      }
      propuestas_centro: {
        Row: {
          created_at: string
          curso: string | null
          email: string
          id: string
          leido: boolean
          nombre: string
          propuesta: string
        }
        Insert: {
          created_at?: string
          curso?: string | null
          email: string
          id?: string
          leido?: boolean
          nombre: string
          propuesta: string
        }
        Update: {
          created_at?: string
          curso?: string | null
          email?: string
          id?: string
          leido?: boolean
          nombre?: string
          propuesta?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      es_admin: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      puede_editar: {
        Args: {
          _seccion: Database["public"]["Enums"]["seccion_sitio"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin_seccion"
      seccion_sitio:
        | "avisos"
        | "calendario"
        | "materias"
        | "capacitaciones"
        | "centro"
        | "galeria"
        | "institucional"
        | "contacto"
        | "configuracion"
        | "usuarios"
      tipo_categoria: "aviso" | "evento" | "capacitacion" | "galeria"
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
    Enums: {
      app_role: ["super_admin", "admin_seccion"],
      seccion_sitio: [
        "avisos",
        "calendario",
        "materias",
        "capacitaciones",
        "centro",
        "galeria",
        "institucional",
        "contacto",
        "configuracion",
        "usuarios",
      ],
      tipo_categoria: ["aviso", "evento", "capacitacion", "galeria"],
    },
  },
} as const
