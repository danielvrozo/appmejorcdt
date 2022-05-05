/* Interfaz, parametros de body en respuesta a SignUP */
export interface LoginPhoneI{
    ChallengeName: string;
    Session:string; 
    ChallengeParameters: PhoneNameI;
    ResponseMetadata: PhoneResponseStatusI;
    message:string;
    code:string;
}
export interface PhoneNameI{
    USERNAME: string;
}
export interface PhoneResponseStatusI{
    RequestId:string;
    HTTPStatusCode: number;
    HTTPHeaders: PhoneRSHTTPHeadersI;
    RetryAttempts:number;
}
/* End */

/* Interfaz, parametros de body en respuesta a sign_in Codigo */
export interface LoginCodeI{
    AuthenticationResult: AuthenticationResultI;
    ResponseMetadata: CodeResponseStatusI;
}

export interface AuthenticationResultI{
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
}

export interface CodeResponseStatusI{
    HTTPStatusCode: number;
}

/* END */



export interface PhoneRSHTTPHeadersI{
    date:string;
    connection: string;
}

