package br.com.sbm.book.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.sbm.book.model.Book;

public interface BookRepository extends CrudRepository<Book, Long>{

}
