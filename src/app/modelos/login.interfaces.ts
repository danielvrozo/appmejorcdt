export interface PhoneNameI{
    USERNAME: string;
}

export interface PhoneRSHTTPHeadersI{
    date:string;
    connection: string;
}

export interface PhoneResponseStatusI{
    RequestId:string;
    HTTPStatusCode: number;
    HTTPHeaders: PhoneRSHTTPHeadersI;
    RetryAttempts:number;
}

export interface LoginPhoneI{
    ChallengeName: string;
    Session:string; 
    ChallengeParameters: PhoneNameI;
    ResponseMetadata: PhoneResponseStatusI;
    message:string;
    code:string;
}

export interface CodeResponseStatusI{
    HTTPStatusCode: number;
}

export interface AuthenticationResultI{
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
}

export interface LoginCodeI{
    AuthenticationResult: AuthenticationResultI;
    ResponseMetadata: CodeResponseStatusI;
}