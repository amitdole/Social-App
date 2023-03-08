import { Photo } from "./photo";

    export interface Friend {
        id: number;
        userName: string;
        photoUrl: string;
        age: number;
        alias: string;
        created: Date;
        lastActive: Date;
        gender: string;
        introduction: string;
        hobbies: string;
        city: string;
        country: string;
        photos: Photo[];
    }