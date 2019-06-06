--COMPLETE LIST OF BOOKS AND THEIR AUTHORS (NESTED,JOIN)
SELECT
    book.title,
    sub.afirst,
    sub.alast,
    sub.isbn
FROM (
    SELECT
        author.authid,
        author.afirst,
        author.alast,
        written_by.isbn
    FROM author
        FULL JOIN written_by
        ON author.authid = written_by.authid
    WHERE written_by.isbn IS NOT NULL) AS sub
FULL JOIN book
ON book.isbn = sub.isbn;

--BOOKS PER PUBLISHER (JOIN,AGGREGATE,GROUP BY)
SELECT publisher.pubname,
       COUNT(book.isbn)
FROM publisher
FULL JOIN book ON publisher.pubname = book.pubname
WHERE publisher.pubname IS NOT NULL
GROUP BY publisher.pubname;
