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

--BOOKS PER PUBLISHED >2 (GROUP BY ME HAVING)
SELECT publisher.pubname,
       COUNT(book.isbn) 
FROM publisher
FULL JOIN book ON publisher.pubname = book.pubname
WHERE publisher.pubname IS NOT NULL
GROUP BY publisher.pubname
HAVING COUNT(book.isbn)>2;

--ORDER BY mlast(ORDER BY)
SELECT member.mfirst,member.mlast,member.memberid
FROM member
ORDER BY member.mlast;

--SHOW MEMBERS WITH POSTAL CODE AT ZOGRAFOU(AGGREGATE)
SELECT member.memberid,
       member.mfirst,
       member.mlast,
       member.postalcode
FROM member
WHERE CAST(member.postalcode as TEXT) LIKE '157%';

--ALL BOOKS WITH THEIR CATEGORIES
SELECT 
    book.isbn,
    book.title,
    book.numpages,
    belongs_to.categoryname
FROM book
FULL JOIN belongs_to ON book.isbn = belongs_to.isbn
ORDER BY book.isbn;
