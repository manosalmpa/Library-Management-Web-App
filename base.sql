--path C:/Users/Vagelis/Documents/dbs/app1/base.sql
DROP TABLE IF EXISTS member CASCADE ; 
CREATE TABLE member(
    memberid SERIAL ,
    mfirst TEXT NOT NULL,
    mlast TEXT NOT NULL,
    street TEXT,
    snumber INT,  
    postalcode INT,
    mbirthdate DATE,
    PRIMARY KEY (memberid)
);
DROP TABLE IF EXISTS publisher CASCADE ;
CREATE TABLE publisher(
    pubname TEXT NOT NULL UNIQUE,
    estyear INT,
    street TEXT,
    snumber INT,
    postalcode INT,
    PRIMARY KEY (pubname)
);
DROP TABLE IF EXISTS author CASCADE ;
CREATE TABLE author(
    authid SERIAL, 
    afirst TEXT NOT NULL,
    alast TEXT NOT NULL,
    abirthdate DATE,
    PRIMARY KEY (authid)
);
DROP TABLE IF EXISTS book CASCADE ;
CREATE TABLE book(
    isbn INT NOT NULL UNIQUE ,
    title TEXT NOT NULL,  
    pubyear INT,
    numpages INT NOT NULL,
    pubname TEXT,
    PRIMARY KEY (isbn),
    UNIQUE (isbn, pubname),
    FOREIGN KEY (pubname) REFERENCES publisher(pubname)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
DROP TABLE IF EXISTS category CASCADE ;
CREATE TABLE category(
    categoryname TEXT NOT NULL ,
    supercategoryname TEXT ,
    PRIMARY KEY (categoryname),
    FOREIGN KEY (supercategoryname) REFERENCES category(categoryname)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS copies CASCADE ;
CREATE TABLE copies(
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    shelf INT,
    UNIQUE (isbn, copynr),
    PRIMARY KEY (isbn,copynr),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS employee CASCADE ;
CREATE TABLE employee(
    empid SERIAL,
    efirst TEXT NOT NULL,
    elast TEXT NOT NULL,
    salary INT,
    PRIMARY KEY (empid)
);
DROP TABLE IF EXISTS permanent_employee ;
CREATE TABLE permanent_employee(
    empid SERIAL,
    hiringdate DATE,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS temporary_employee ;
CREATE TABLE temporary_employee(
    empid INT ,
    contractnr INT,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS borrows CASCADE ;
CREATE TABLE borrows(
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL ,
    date_of_borrowing DATE NOT NULL,
    date_of_return DATE,
    UNIQUE (memberid, isbn, copynr,date_of_borrowing),
    PRIMARY KEY (memberid,isbn,copynr,date_of_borrowing),
    FOREIGN KEY (memberid) REFERENCES member(memberid)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (isbn,copynr) REFERENCES copies(isbn,copynr)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS belongs_to ;
CREATE TABLE belongs_to(
    isbn INT NOT NULL,
    categoryname TEXT NOT NULL,
    PRIMARY KEY (isbn,categoryname),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (categoryname) REFERENCES category(categoryname)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
DROP TABLE IF EXISTS reminder ;
CREATE TABLE reminder(
    empid INT NOT NULL,
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    date_of_borrowing DATE NOT NULL,
    date_of_reminder DATE NOT NULL,
    UNIQUE (memberid, isbn, copynr, date_of_borrowing) ,
    PRIMARY KEY (empid,memberid,isbn,copynr,date_of_borrowing,date_of_reminder),
    FOREIGN KEY (empid) REFERENCES employee(empid)
    ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (memberid) REFERENCES member(memberid)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (memberid, isbn, copynr, date_of_borrowing) 
    REFERENCES borrows(memberid, isbn, copynr, date_of_borrowing)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (isbn,copynr) REFERENCES copies(isbn, copynr)
    ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS written_by ;
CREATE TABLE written_by(
    isbn INT NOT NULL,
    authid INT NOT NULL,
    PRIMARY KEY (isbn,authid),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (authid) REFERENCES author(authid)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

