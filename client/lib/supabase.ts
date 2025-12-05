import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadPhotoProof = async (file: File, raidId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${raidId}-${Date.now()}.${fileExt}`;
  const filePath = `raid-proofs/${fileName}`;

  const { data, error } = await supabase.storage
    .from('recipe-raid')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('recipe-raid')
    .getPublicUrl(filePath);

  return { publicUrl, storagePath: filePath };
};

export const deletePhotoProof = async (storagePath: string) => {
  const { error } = await supabase.storage
    .from('recipe-raid')
    .remove([storagePath]);

  if (error) {
    throw error;
  }
};
