export interface SortItem {
    sortName: string;
    sortId: number;
    parentId?: number;
    description?: string;
    status?: number;
    createdTime: number;
    updatedTime: number;
};

export interface SortItemParams {
    sortName?: string;
    sortId?: number;
    parentId?: number;
    description?: string;
    status?: number;
    createdTime?: number;
    updatedTime?: number;
    pageSize?:number;
    current?:number;
}
