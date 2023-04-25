export interface Pagination{
    currentPage: number;
    itemsPerPage: number;
    totalItemPerPage: number;
    totalPages: number
}

export class PaginatedResult<T>{
    result?: T
    pagination?: Pagination
}