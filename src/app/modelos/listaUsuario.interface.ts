export interface CDTsI {
    
    id: number;
    cdt_id: number;
    bank: string;
    url_cdt: string;
    date_open: string;
    date_expiration: string;
    amount: number;
    roi: number;
    term: number;
    rate: number;
    j:any;

}


export interface ListUserI {
    avatar:string;
    fullname:string;
    phone: string;
    level: number;
    score: number;
    cdts:CDTsI[];
    valid_show: string;
}




