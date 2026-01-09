import type { UploadResponse } from '@/types/admin';

export const uploadToImgBB = async (file: File): Promise<UploadResponse> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    
    if (!apiKey) {
      throw new Error('ImgBB API key não configurada');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', apiKey);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Erro no upload'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    };
  }
};