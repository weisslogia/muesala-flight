export type Signup = {
    name: string;
    password: string;
    email: string;
}

export type SignupResponse = {
    email: string;
    id: string;
    name: string;
    token: string;
    refreshToken: string;
}