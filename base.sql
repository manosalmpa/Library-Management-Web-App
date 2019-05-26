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
CREATE TABLE publisher(
    pubname TEXT NOT NULL UNIQUE,
    estyear INT,
    street TEXT,
    snumber INT,
    postalcode INT,
    PRIMARY KEY (pubname)
);
CREATE TABLE book(
    isbn INT NOT NULL UNIQUE ,
    title TEXT NOT NULL,  
    pubyear INT,
    numpages INT NOT NULL,
    pubname TEXT,
    PRIMARY KEY (isbn),
    UNIQUE (isbn, pubname),
    FOREIGN KEY (pubname) REFERENCES publisher(pubname)
);
CREATE TABLE author(
    authid INT NOT NULL UNIQUE , 
    afirst TEXT NOT NULL,
    alast TEXT NOT NULL,
    abirthdate DATE,
    PRIMARY KEY (authid)
);
CREATE TABLE category(
    categoryname TEXT NOT NULL ,
    supercategoryname TEXT NOT NULL ,
    PRIMARY KEY (categoryname),
    FOREIGN KEY (supercategoryname) REFERENCES category(categoryname)
);

CREATE TABLE copies(
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    shelf INT,
    UNIQUE (isbn, copynr),
    PRIMARY KEY (isbn,copynr),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
);

CREATE TABLE employee(
    empid INT NOT NULL UNIQUE,
    efirst TEXT NOT NULL,
    elast TEXT NOT NULL,
    salary INT,
    PRIMARY KEY (empid)
);
CREATE TABLE permanent_employee(
    empid INT NOT NULL UNIQUE ,
    hiringdate DATE,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
CREATE TABLE temporary_employee(
    empid INT NOT NULL UNIQUE ,
    contractnr INT,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
CREATE TABLE borrows(
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL ,
    date_of_borrowing DATE NOT NULL,
    date_of_return DATE,
    UNIQUE (memberid, isbn, copynr,date_of_borrowing),
    PRIMARY KEY (memberid,isbn,copynr,date_of_borrowing),
    FOREIGN KEY (memberid) REFERENCES member(memberid),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (isbn,copynr) REFERENCES copies(isbn,copynr)
);
CREATE TABLE belongs_to(
    isbn INT NOT NULL,
    categoryname TEXT NOT NULL,
    PRIMARY KEY (isbn,categoryname),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (categoryname) REFERENCES category(categoryname)
);
CREATE TABLE reminder(
    empid INT NOT NULL,
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    date_of_borrowing DATE NOT NULL,
    date_of_reminder DATE NOT NULL,
    UNIQUE (memberid, isbn, copynr, date_of_borrowing) ,
    PRIMARY KEY (empid,memberid,isbn,copynr,date_of_borrowing,date_of_reminder),
    FOREIGN KEY (empid) REFERENCES employee(empid),
    FOREIGN KEY (memberid) REFERENCES member(memberid),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (memberid, isbn, copynr, date_of_borrowing) 
    REFERENCES borrows(memberid, isbn, copynr, date_of_borrowing),
    FOREIGN KEY (isbn,copynr) REFERENCES copies(isbn, copynr)
);
CREATE TABLE written_by(
    isbn INT NOT NULL,
    authid INT NOT NULL,
    PRIMARY KEY (isbn,authid),
    FOREIGN KEY (isbn) REFERENCES book(isbn),
    FOREIGN KEY (authid) REFERENCES author(authid)
);

