export interface ResponseError {
    code: number;
    message: string;
    type: string;
    errors?: boolean
}