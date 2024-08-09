import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  books: Book[] = []; //Armazena a lista de livros.
  newBook: Book = {}; //Um objeto de livro que será usado para adicionar um novo livro.
  selectedBook: Book | null = null; //Armazena o livro selecionado para edição ou visualização.
  showAddForm: boolean = false; //Controla a exibição do formulário de adição de livro.
  searchParams: any = {}; //Armazena os parâmetros de pesquisa para o filtro.

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  startAddBook(): void {
    this.showAddForm = true;
    /*
    Define showAddForm como true para exibir o formulário de adição de livro.
    */
  }

  cancelAddBook(): void {
    this.showAddForm = false;
    /*
    Define showAddForm como false, ocultando o formulário de adição de livro
    */
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
    /*
    Chama getBooks() do BookService para buscar a lista de livros e armazena o resultado em books.
    */
  }

  createBook(): void {
    this.bookService.createBook(this.newBook).subscribe((book: Book) => {
      this.books.push(book);
      this.newBook = {};
      this.showAddForm = false;
    });
    /*
    Chama createBook() do BookService para adicionar um novo livro. Após a criação, o livro é adicionado à lista books, newBook é resetado para um objeto vazio, e showAddForm é definido como false.
    */
  }

  updateBook(): void {
    if (this.selectedBook) {
      this.bookService.updateBook(this.selectedBook.id!, this.selectedBook).subscribe((book: Book) => {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          this.books[index] = book;
        }
        this.selectedBook = null;
      });
    }
    /*
    Atualiza o livro selecionado (selectedBook) chamando updateBook() do BookService. Se a atualização for bem-sucedida, o livro na lista books é substituído pelo livro atualizado, e selectedBook é definido como null.
    */
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(() => {
      this.books = this.books.filter(b => b.id !== id);
    });
    /*
    Remove um livro da lista, chamando deleteBook() do BookService com o id do livro. Após a exclusão, o livro é removido da lista books.
    */
  }

  searchBooks(): void {
    this.bookService.searchBooks(this.searchParams).subscribe((data: Book[]) => {
      this.books = data;
    });
    /*
    Chama searchBooks() do BookService passando searchParams como parâmetro. A lista books é atualizada com o resultado da busca.
    */
  }

  selectBook(book: Book): void {
    this.selectedBook = { 
      ...book, 
      register: book.register ? this.formatDateForInput(new Date(book.register)) : ''
    };
    /*
    Quando um livro é selecionado para edição, este método copia o livro selecionado para selectedBook, formatando a data de registro (register) para exibição em um campo de entrada.
    */
  }

  formatDateForInput(date: Date): string {
    const addZero = (n: number) => n < 10 ? '0' + n : n; //adiciona um zero à esquerda ('0') para números menores que 10.

    return date.getFullYear() + '-' + //retorna o ano com quatro dígitos.
    addZero(date.getMonth() + 1) + '-' + // formata o mês com dois dígitos, adicionando 1 porque os meses em JavaScript são baseados em zero.
    addZero(date.getDate()) + 'T' + //formata o dia com dois dígitos.
    addZero(date.getHours()) + ':' + //formata a hora com dois dígitos.
    addZero(date.getMinutes()); //formata os minutos com dois dígitos.
  }

  clearSelection(): void {
    this.selectedBook = null;
    /*
    Reseta a seleção do livro (selectedBook) para null, deselecionando qualquer livro que estava em edição ou visualização.
    */
  }

  clearFilters(): void {
    this.searchParams = {}; // Limpa todos os campos do filtro
    this.loadBooks(); // Recarrega todos os livros
  }
}
