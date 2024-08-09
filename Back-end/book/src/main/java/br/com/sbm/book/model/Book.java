package br.com.sbm.book.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Table("book")
public class Book {

	@Id
	private Long id;
	private String isbn;
	private Integer pages;
	private String cover;
	//@JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
	private LocalDateTime register;
	
	public Book() {
	}
	
	public Book(Long id, String isbn, Integer  pages, String cover, LocalDateTime register) {
		this.id = id;
		this.isbn = isbn;
		this.pages = pages;
		this.cover = cover;
		this.register = register;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(Integer pages) {
		this.pages = pages;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public LocalDateTime  getRegister() {
		return register;
	}

	public void setRegister(LocalDateTime register) {
		this.register = register;
	}
	
}
