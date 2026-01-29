import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const PHOTOS_BUCKET = "photos";

export async function uploadImage(
  file: Blob,
  fileName: string,
): Promise<{ path: string; url: string } | null> {
  try {
    const filePath = `${Date.now()}_${fileName}`;

    const { data, error } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .upload(filePath, file, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(PHOTOS_BUCKET)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  try {
    console.log("Attempting to delete from storage:", path);

    const { data, error } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .remove([path]);

    if (error) {
      console.error("Storage delete error:", error.message, error);
      return false;
    }

    console.log("Storage delete result:", data);
    return true;
  } catch (err) {
    console.error("Storage delete failed:", err);
    return false;
  }
}

export async function initAnonymousSession(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return session.user.id;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error("Anonymous auth error:", error);
      return null;
    }

    return data.user?.id || null;
  } catch (err) {
    console.error("Session init failed:", err);
    return null;
  }
}
