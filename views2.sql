--fiction
CREATE VIEW fiction AS 
    SELECT book.isbn,
        book.title,
        book.numpages,
        belongs_to.categoryname
    FROM book
    FULL JOIN belongs_to ON book.isbn = belongs_to.isbn
    WHERE belongs_to.categoryname = 'fiction'
    ORDER BY book.isbn;

--automatically updateable view
CREATE VIEW memberview AS
    SELECT *
    FROM member;