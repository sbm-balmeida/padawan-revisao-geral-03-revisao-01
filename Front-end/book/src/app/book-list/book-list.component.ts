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
    const formattedSearchParams = {
      isbn: this.searchParams.isbn || null,
      /*
      Verifica se o campo isbn dentro de searchParams contém um valor. Se sim, esse valor é incluído em formattedSearchParams; caso contrário, null é atribuído.
      */
      pages: this.searchParams.pages || null,
      cover: this.searchParams.cover || null,
      startDate: this.searchParams.startDate ? this.formatDateForInput(new Date(this.searchParams.startDate)) : null,
      /*
      Verifica se o campo startDate foi preenchido pelo usuário. Se sim, a data é formatada usando a função formatDateForInput e o resultado é atribuído ao formattedSearchParams. Se o campo estiver vazio, null será usado.

      new Date(this.searchParams.startDate) -> cria um objeto Date a partir do valor fornecido, e this.formatDateForInput formata essa data no formato esperado pelo back-end.
      */
      endDate: this.searchParams.endDate ? this.formatDateForInput(new Date(this.searchParams.endDate)) : null
    };
  
    this.bookService.searchBooks(formattedSearchParams).subscribe((data: Book[]) => {
      this.books = data;
    });
    /*
    this.bookService.searchBooks(formattedSearchParams) -> Chama o método searchBooks no serviço BookService, passando formattedSearchParams como argumento. Esse método é responsável por enviar uma requisição HTTP ao back-end com os parâmetros de busca.

    .subscribe((data: Book[]) => { this.books = data; }) -> O método subscribe é usado para assinar o Observable retornado pelo serviço. Quando a resposta da busca é recebida (ou seja, quando os dados são carregados do back-end), a função de callback é executada.

    A função de callback recebe os dados (neste caso, uma lista de objetos Book), e os armazena na variável this.books, que é a lista de livros exibida no componente.
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
