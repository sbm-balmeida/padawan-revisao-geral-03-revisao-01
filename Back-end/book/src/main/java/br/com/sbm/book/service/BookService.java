package br.com.sbm.book.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sbm.book.model.Book;

@Service
public class BookService {

	@Autowired
    private DataSource dataSource;

    public Book createBook(Book book) throws SQLException {
    	String insertSql = "INSERT INTO book (isbn, pages, cover, register) VALUES (?, ?, ?, now())";
        String selectSql = "SELECT id, isbn, pages, cover, register FROM book WHERE id = ?";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement insertPstm = connection.prepareStatement(insertSql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            
            insertPstm.setString(1, book.getIsbn());
            insertPstm.setInt(2, book.getPages());
            insertPstm.setString(3, book.getCover());
            insertPstm.executeUpdate();

            try (ResultSet generatedKeys = insertPstm.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    long generatedId = generatedKeys.getLong(1);

                    // Recuperar o registro completo, incluindo o `register`
                    try (PreparedStatement selectPstm = connection.prepareStatement(selectSql)) {
                        selectPstm.setLong(1, generatedId);
                        try (ResultSet rs = selectPstm.executeQuery()) {
                            if (rs.next()) {
                                book.setId(rs.getLong("id"));
                                book.setIsbn(rs.getString("isbn"));
                                book.setPages(rs.getInt("pages"));
                                book.setCover(rs.getString("cover"));
                                book.setRegister(rs.getTimestamp("register").toLocalDateTime());
                            }
                        }
                    }
                }
            }
        }
        return book;
    }
    
    public List<Book> readBooks() throws SQLException {
    	List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM book;";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstm = connection.prepareStatement(sql);
             ResultSet rst = pstm.executeQuery()) {

            while (rst.next()) {               
                Book book = new Book(
                        rst.getLong("id"), 
                        rst.getString("isbn"), 
                        rst.getInt("pages"), 
                        rst.getString("cover"),
                        rst.getTimestamp("register").toLocalDateTime());
                books.add(book);
            }
        }
        return books;
    }
    
    public Book updateBook(Long id, Book book) throws SQLException {
    	if (id == null || book == null) {
            throw new IllegalArgumentException("ID and Book must not be null");
        }
        
        String sql = "UPDATE book SET isbn = ?, pages = ?, cover = ?, register = ? WHERE id = ?;";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstm = connection.prepareStatement(sql)) {

            pstm.setString(1, book.getIsbn());
            pstm.setInt(2, book.getPages());
            pstm.setString(3, book.getCover());
            pstm.setTimestamp(4, Timestamp.valueOf(book.getRegister()));
            pstm.setLong(5, id);

            int rowsAffected = pstm.executeUpdate();
            if (rowsAffected > 0) {
                book.setId(id);
                return book;
            } else {
                return null;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    public void deleteBook(Long id) throws SQLException {
        String sql = "DELETE FROM book WHERE id = ?";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstm = connection.prepareStatement(sql)) {
            pstm.setLong(1, id);
            pstm.executeUpdate();
        }
    }
    
    public List<Book> searchBooks(String isbn, Integer pages, String cover, LocalDateTime register) throws SQLException {
        List<Book> books = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM book WHERE 1=1");

        if (isbn != null && !isbn.isEmpty()) {
            sql.append(" AND isbn LIKE ?");
        }
        if (pages != null) {
            sql.append(" AND pages = ?");
        }
        if (cover != null && !cover.isEmpty()) {
            sql.append(" AND cover LIKE ?");
        }
        if (register != null) {
            sql.append(" AND register >= ? AND register < ?");
        }

        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstm = connection.prepareStatement(sql.toString())) {

            int paramIndex = 1;

            if (isbn != null && !isbn.isEmpty()) {
                pstm.setString(paramIndex++, "%" + isbn + "%");
            }
            if (pages != null) {
                pstm.setInt(paramIndex++, pages);
            }
            if (cover != null && !cover.isEmpty()) {
                pstm.setString(paramIndex++, "%" + cover + "%");
            }
            if (register != null) {
                pstm.setObject(paramIndex++, register.withSecond(0).withNano(0));  // Ignora os segundos e nanosegundos
                pstm.setObject(paramIndex++, register.withSecond(0).withNano(0).plusMinutes(1));  // Até um minuto depois
            }

            try (ResultSet rst = pstm.executeQuery()) {
                while (rst.next()) {
                    Book book = new Book(
                            rst.getLong("id"),
                            rst.getString("isbn"),
                            rst.getInt("pages"),
                            rst.getString("cover"),
                            rst.getObject("register", LocalDateTime.class)
                    );
                    books.add(book);
                }
            }
        }
        return books;
    }

}
