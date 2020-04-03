export class Details {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
}

export class DataModel {
    area: string[];
    items: string[];
    vendor: string;
    contact: string[];
    sms: boolean;
    whatsapp: boolean;
    viber: boolean;
    email: string;
    website: string;
    contactComment: string;
    comments: string[];
}

export class SocialMedia {
    sms: boolean;
    whatsapp: boolean;
    viber: boolean;
}

export class DataList {
    areas: string[];
    vendors: string[];
    items: string[];
    dataList: DataModel[];
}

export class PharmacyModel {
    no: string;
    district: string;
    area: string;
    name: string;
    address: string;
    contactNo: string;
    whatsapp: string;
    viber: string;
    email: string;
    owner: string;
    pharmacist: string;
}

export class PharmacyList {
    districts: string[];
    areas: string[];
    pharmacys: string[];
    dataList: PharmacyModel[];
}
