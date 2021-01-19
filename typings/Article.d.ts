export interface ArticleItem {
    title: string;
    articleId: number;
    sortId?: number;
    description?: string;
    status?: number;
    createdTime: number;
    updatedTime: number;
}

export interface ArticleItemParams {
    title?: string;
    articleId?: number;
    sortId?: number;
    description?: string;
    status?: number;
    createdTime?: number;
    updatedTime?: number;
    pageSize?:number;
    current?:number;
}
