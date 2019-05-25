--DROP TABLE  member CASCADE ;
CREATE TABLE member(
    memberid INT NOT NULL UNIQUE ,
    mfirst TEXT NOT NULL,
    mlast TEXT NOT NULL,
    street TEXT,
    snumber INT,  
    postalcode INT,
    mbirthdate DATE,
    PRIMARY KEY (memberid)
);
--DROP TABLE book CASCADE ;
CREATE TABLE book(
    isbn INT NOT NULL UNIQUE ,
    title TEXT NOT NULL,  
    pubyear INT,
    numpages INT NOT NULL,
    pubname TEXT,
    PRIMARY KEY (isbn)
);
--DROP TABLE author CASCADE ;
CREATE TABLE author(
    authid INT NOT NULL UNIQUE , 
    afirst TEXT NOT NULL,
    alast TEXT NOT NULL,
    abirthdate DATE,
    PRIMARY KEY (authid)
);
--DROP TABLE category CASCADE ;
CREATE TABLE category(
    categoryname TEXT NOT NULL ,
    supercategoryname TEXT NOT NULL ,
    PRIMARY KEY (categoryname),
    FOREIGN KEY (supercategoryname) REFERENCES category(categoryname)
);
--DROP TABLE copies CASCADE ;
CREATE TABLE copies(
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    shelf INT,
    PRIMARY KEY (isbn,copynr)
);
--DROP TABLE publisher CASCADE ;
CREATE TABLE publisher(
    pubname TEXT NOT NULL,
    estyear INT,
    street TEXT,
    snumber INT,
    postalcode INT,
    PRIMARY KEY (pubname)
);
--DROP TABLE employee CASCADE ;
CREATE TABLE employee(
    empid INT NOT NULL UNIQUE,
    efirst TEXT NOT NULL,
    elast TEXT NOT NULL,
    salary INT,
    PRIMARY KEY (empid)
);
--DROP TABLE permanent_employee CASCADE ;
CREATE TABLE permanent_employee(
    empid INT NOT NULL UNIQUE ,
    hiringdate DATE,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
--DROP TABLE temporary_employee CASCADE ;
CREATE TABLE temporary_employee(
    empid INT NOT NULL UNIQUE ,
    contractnr INT,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
--DROP TABLE borrows CASCADE ;
CREATE TABLE borrows(
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    date_of_borrowing DATE NOT NULL,
    date_of_return DATE,
    PRIMARY KEY (memberid,isbn,copynr,date_of_borrowing),
    FOREIGN KEY (memberid) REFERENCES member(memberid),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (copynr) REFERENCES copies(copynr)
);
--DROP TABLE belongs_to CASCADE ;
CREATE TABLE belongs_to(
    isbn INT NOT NULL,
    categoryname TEXT NOT NULL,
    PRIMARY KEY (isbn,categoryname),
    UNIQUE FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (categoryname) REFERENCES category(categoryname)
);
--DROP TABLE reminder IF EXISTS CASCADE ;
CREATE TABLE reminder(
    empid INT NOT NULL,
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    date_of_borrowing DATE NOT NULL,
    date_of_reminder DATE NOT NULL,
    PRIMARY KEY (empid,memberid,isbn,copynr,date_of_borrowing,date_of_reminder),
    FOREIGN KEY (empid) REFERENCES employee(empid),
    FOREIGN KEY (memberid) REFERENCES member(memberid),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (copynr) REFERENCES copies(copynr),
    FOREIGN KEY (date_of_borrowing) REFERENCES borrows(date_of_borrowing)
);
--DROP TABLE written_by CASCADE ;
CREATE TABLE written_by(
    isbn INT NOT NULL,
    authid INT NOT NULL,
    PRIMARY KEY (isbn,authid),
    UNIQUE FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (authid) REFERENCES author(authid)
);

ALTER TABLE book ADD FOREIGN KEY (pubname) REFERENCES publisher(pubname);
ALTER TABLE copies ADD FOREIGN KEY (isbn) REFERENCES book(isbn);
