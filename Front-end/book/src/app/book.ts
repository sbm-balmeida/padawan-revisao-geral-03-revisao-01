import { Data } from "@angular/router";

export class Book {
    id?: number;
    isbn?: string;
    pages?: number;
    cover?: string;
    register?: string;

    constructor(id: number, isbn: string, pages: number, cover: string, register: string) {
        this.id = id;
        this.isbn = isbn;
        this.pages = pages;
        this.cover = cover;
        this.register = register;
    }
}
