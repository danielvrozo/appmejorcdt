export interface codeVerificationI{
    Mensaje: string;
}

export interface CDTsI {
    amount: number;
    roi: number;
}

export interface codeVerificationSMSI{
    message: string;
    cdts: CDTsI[]
}