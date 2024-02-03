export interface Flight {
    code: string;
    capacity: number;
    departureDate: string;
    status: "none" | "ready" | "processing";
    img: string;
    id?: string;
}

export interface FlightResponse {
    total: number;
    count: number;
    resources: Flight[];
}