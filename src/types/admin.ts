
export interface Photo {
    id: string;
    name: string;
    url: string;
    category: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    order: number;
}

export interface UploadResponse {
    success: boolean;
    url?: string;
    error?: string;
}