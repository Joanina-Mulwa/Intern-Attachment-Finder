export class InterviewModel {
    id?: number;
    internshipId?: number;
    mode?: Mode;
    link?: string;
    location?: Location;
    address?: string;
    date?: string;
    time?: string;
    important?: string;
    constructor(
        id?: number,
        internshipId?: number,
        mode?: Mode,
        link?: string,
        location?: Location,
        address?: string,
        date?: string,
        time?: string,
        important?: string,
    ) {
        this.id = id;
        this.internshipId = internshipId;
        this.mode = mode;
        this.link = link;
        this.location = location;
        this.address = address;
        this.date = date;
        this.time = time;
        this.important = important;

    }
}
export enum Mode {
    ONSITE = 'ONSITE',
    REMOTE = 'REMOTE',
}
export enum Location {
    BARINGO = 'Baringo',
    BOMET = 'Bomet',
    BUNGOMA = 'Bungoma',
    BUSIA = 'Busia',
    EMBU = 'Embu',
    GARISSA = 'Garissa',
    HOMABAY = 'Homabay',
    ISIOLO = 'Isiolo',
    KAJIADO = 'Kajiado',
    KAKAMEGA = 'Kakamega',
    KERICHO = 'Kericho',
    KIAMBU = 'Kiambu',
    KILIFI = 'Kilifi',
    KIRINYAGA = 'Kirinyaga',
    KISII = 'Kisii',
    KISUMU = 'Kisumu',
    KITUI = 'Kitui',
    KWALE = 'Kwale',
    LAIKIPIA = 'Laikipia',
    LAMU = 'Lamu',
    MACHAKOS = 'Machakos',
    MAKUENI = 'Makueni',
    MANDERA = 'Mandera',
    MARAKWET = 'Marakwet',
    MARSABIT = 'Marsabit',
    MERU = 'Meru',
    MIGORI = 'Migori',
    MOMBASA = 'Mombasa',
    MURANGA = 'Muranga',
    NAIROBICITY = 'Nairobi',
    NAKURU = 'Nakuru',
    NANDI = 'Nandi',
    NAROK = 'Narok',
    NYAMIRA = 'Nyamira',
    NYANDARUA = 'Nyandarua',
    NYERI = 'Nyeri',
    SAMBURU = 'Samburu',
    SIAYA = 'Siaya',
    TAITATAVETA = 'Taita Taveta',
    TANARIVER = 'Tana River',
    THARAKANITHI = 'Tharaka Nithi',
    TRANSNZOIA = 'Transnzoia',
    TURKANA = 'Turkana',
    UASINGISHU = 'Uasin Gishu',
    VIHIGA = 'Vihiga',
    WAJIR = 'Wajir',
    WESTPOKOT = 'Weat Pokot',
}