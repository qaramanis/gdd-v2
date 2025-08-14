import { supabase } from "@/database/supabase";

export interface SceneMetadata {
  name: string;
  description?: string;
  engine: "unity" | "unreal" | "godot" | "custom";
  engineVersion?: string;
  sectionId?: string;
  tags?: string[];
}

export interface Scene {
  id: string;
  game_id: string;
  document_section_id?: string;
  name: string;
  description?: string;
  engine: string;
  engine_version?: string;
  storage_type: string;
  scene_url?: string;
  bucket_path?: string;
  thumbnail_url?: string;
  file_size?: number;
  file_format?: string;
  scene_data?: any;
  version: number;
  status: string;
  is_public: boolean;
  is_playable: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  scene_tags?: { tag: string }[];
  document_sections?: { title: string };
}

export class SceneService {
  private static readonly BUCKETS = {
    WEBGL: "game-scenes-webgl",
    FILES: "game-scene-files",
    THUMBNAILS: "game-scene-thumbnails",
  } as const;

  static async uploadScene(
    gameId: string,
    file: File,
    metadata: SceneMetadata,
    userId: string,
  ) {
    try {
      // Determine storage strategy based on file type
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const isWebGL = ["html", "data", "wasm", "js"].includes(fileExt || "");
      const bucket = isWebGL ? this.BUCKETS.WEBGL : this.BUCKETS.FILES;

      // Generate unique path
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${gameId}/${timestamp}_${safeName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL if applicable
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      // Save metadata to database
      const { data: sceneData, error: dbError } = await supabase
        .from("game_scenes")
        .insert({
          game_id: gameId,
          document_section_id: metadata.sectionId,
          name: metadata.name,
          description: metadata.description,
          engine: metadata.engine,
          engine_version: metadata.engineVersion,
          storage_type: "supabase",
          bucket_path: path,
          scene_url: publicUrl,
          file_size: file.size,
          file_format: `.${fileExt}`,
          is_playable: isWebGL,
          scene_data: {
            originalFileName: file.name,
            mimeType: file.type,
            uploadedAt: new Date().toISOString(),
          },
          created_by: userId,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Add tags if provided
      if (metadata.tags && metadata.tags.length > 0) {
        await this.addTags(sceneData.id, metadata.tags);
      }

      return { success: true, scene: sceneData };
    } catch (error) {
      console.error("Scene upload error:", error);
      return { success: false, error };
    }
  }

  static async linkExternalScene(
    gameId: string,
    externalUrl: string,
    metadata: SceneMetadata,
    userId: string,
  ) {
    const { data, error } = await supabase
      .from("game_scenes")
      .insert({
        game_id: gameId,
        document_section_id: metadata.sectionId,
        name: metadata.name,
        description: metadata.description,
        engine: metadata.engine,
        engine_version: metadata.engineVersion,
        storage_type: "external",
        scene_url: externalUrl,
        is_playable: true,
        created_by: userId,
      })
      .select()
      .single();

    if (!error && data && metadata.tags && metadata.tags.length > 0) {
      await this.addTags(data.id, metadata.tags);
    }

    return { data, error };
  }

  static async getScenesByGame(gameId: string) {
    const { data, error } = await supabase
      .from("game_scenes")
      .select(
        `
        *,
        scene_tags (tag),
        document_sections:document_section_id (title)
      `,
      )
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    return { data, error };
  }

  static async deleteScene(sceneId: string) {
    // First, get the scene to check if it has a bucket_path
    const { data: scene } = await supabase
      .from("game_scenes")
      .select("bucket_path, storage_type")
      .eq("id", sceneId)
      .single();

    // Delete from storage if it exists
    if (scene?.bucket_path && scene.storage_type === "supabase") {
      const bucket = scene.bucket_path.includes(".html")
        ? this.BUCKETS.WEBGL
        : this.BUCKETS.FILES;

      await supabase.storage.from(bucket).remove([scene.bucket_path]);
    }

    // Delete from database (tags will cascade delete)
    const { error } = await supabase
      .from("game_scenes")
      .delete()
      .eq("id", sceneId);

    return { error };
  }

  static async updateScene(sceneId: string, updates: Partial<Scene>) {
    const { data, error } = await supabase
      .from("game_scenes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sceneId)
      .select()
      .single();

    return { data, error };
  }

  private static async addTags(sceneId: string, tags: string[]) {
    const tagRecords = tags.map((tag) => ({
      scene_id: sceneId,
      tag: tag.toLowerCase().trim(),
    }));

    await supabase.from("scene_tags").insert(tagRecords);
  }
}
