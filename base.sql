CREATE TABLE member(
    memberid INT NOT NULL,
    mfirst TEXT,
    mlast TEXT,
    street TEXT,
    snumber INT,  
    postalcode INT,
    mbirthdate DATE,
    PRIMARY KEY (memberid)
);
CREATE TABLE book(
    isbn INT NOT NULL,
    title TEXT,  
    pubyear INT,
    numpages INT,
    pubname TEXT,
    PRIMARY KEY (isbn)
    --FOREIGN KEY (pubname) REFERENCES publisher(pubname)
);
CREATE TABLE author(
    authid INT NOT NULL, 
    afirst TEXT,
    alast TEXT,
    abirthdate DATE,
    PRIMARY KEY (authid)
);
CREATE TABLE category(
    categoryname TEXT NOT NULL,
    supercategoryname TEXT,
    PRIMARY KEY (categoryname),
    FOREIGN KEY (supercategoryname) REFERENCES category(categoryname)
);
CREATE TABLE copies(
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    shelf INT,
    PRIMARY KEY (isbn,copynr)
    --FOREIGN KEY (isbn) REFERENCES book(isbn)
);
CREATE TABLE publisher(
    pubname TEXT NOT NULL,
    estyear INT,
    street TEXT,
    snumber INT,
    postalcode INT,
    PRIMARY KEY (pubname)
);
CREATE TABLE employee(
    empid INT NOT NULL,
    efrist TEXT,
    elast TEXT,
    salary INT,
    PRIMARY KEY (empid)
);
CREATE TABLE permanent_employee(
    empid INT NOT NULL,
    hiringdate DATE,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
CREATE TABLE temporary_employee(
    empid INT NOT NULL,
    contractnr INT,
    PRIMARY KEY (empid),
    FOREIGN KEY (empid) REFERENCES employee(empid)
);
CREATE TABLE borrows(
    memberid INT NOT NULL,
    isbn INT NOT NULL,
    copynr INT NOT NULL,
    date_of_borrowing DATE NOT NULL,
    date_of_return DATE,
    PRIMARY KEY (memberid,isbn,copynr,date_of_borrowing),
    FOREIGN KEY (memberid) REFERENCES member(memberid),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    --FOREIGN KEY (isbn) REFERENCES copies(isbn)
    --FOREIGN KEY (copynr) REFERENCES copies(copynr)
);
CREATE TABLE belongs_to(
    isbn INT NOT NULL,
    categoryname TEXT NOT NULL,
    PRIMARY KEY (isbn,categoryname),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    --FOREIGN KEY (categoryname) REFERENCES category(categoryname)
);
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
    FOREIGN KEY (memberid) REFERENCES borrows(memberid),
    --FOREIGN KEY (isbn) REFERENCES borrows(isbn),
    FOREIGN KEY (copynr) REFERENCES borrows(copynr),
    FOREIGN KEY (date_of_borrowing) REFERENCES borrows(date_of_borrowing),
    --FOREIGN KEY (isbn) REFERENCES copies(isbn)
    --FOREIGN KEY (copynr) REFERENCES copies(copynr)
);
CREATE TABLE written_by(
    isbn INT NOT NULL,
    authid INT NOT NULL,
    PRIMARY KEY (isbn,authid),
    FOREIGN KEY (isbn) REFERENCES book(isbn)
    --FOREIGN KEY (authid) REFERENCES author(authid)
);

ALTER TABLE book ADD FOREIGN KEY (pubname) REFERENCES publisher(pubname);
ALTER TABLE copies ADD FOREIGN KEY (isbn) REFERENCES book(isbn);
ALTER TABLE borrows ADD FOREIGN KEY (copynr) REFERENCES copies(copynr);
ALTER TABLE belongs_to ADD FOREIGN KEY (categoryname) REFERENCES category(categoryname);
ALTER TABLE written_by ADD FOREIGN KEY (authid) REFERENCES author(authid);