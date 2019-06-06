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
    empid INT ,
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

--auto create reminder from borrowing
CREATE OR REPLACE FUNCTION create_reminder() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO reminder 
    VALUES ('1', NEW.memberid, NEW.isbn, NEW.copynr, NEW.date_of_borrowing, NEW.date_of_return) ;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cr_reminder ON borrows;

CREATE TRIGGER cr_reminder
AFTER INSERT ON borrows FOR EACH ROW EXECUTE PROCEDURE create_reminder();


--category subcategory
CREATE OR REPLACE FUNCTION supercat() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
X text;
BEGIN
SELECT supercategoryname INTO X FROM category WHERE categoryname=NEW.categoryname;
IF LENGTH(X) > 0 THEN
    INSERT INTO belongs_to
    VALUES(NEW.isbn, X);
END IF;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS super ON belongs_to;

CREATE TRIGGER super
AFTER INSERT ON belongs_to FOR EACH ROW EXECUTE PROCEDURE supercat();


--path C:/Users/Vagelis/Documents/dbs/app1/ins.sql
INSERT INTO member
    (mfirst, mlast,postalcode)
VALUES
    ('michalis', 'xatzis','15773'),
    ('vaggelis', 'viskadouros','15773'),
    ('manos', 'alba','15772'),
    ('panos','kousoulos','15771'),
    ('vaggelis','psaradelis','19673'),
    ('xaris','xoulakis','21345');

INSERT INTO publisher (pubname)
VALUES ('patakis'), ('oikonomopoulos'), ('tsotras'), ('garoutsos');

INSERT INTO book (isbn, title , numpages, pubname )
VALUES  ('1948576910', 'Game of Thrones', '520','patakis'),
        ('1574930452', 'False Step','421','oikonomopoulos'),
        ('1595003214', 'Along the Broken Bay','776','tsotras'),
        ('1743549801', 'Bad Therapist', '541','garoutsos'),
        ('1309458796', 'Metro 2033', '630','garoutsos'),
        ('1134589703', 'X-net', '320','garoutsos'),
        ('1456907891', 'The Oracle', '450','tsotras');


INSERT INTO author
    ( afirst, alast )
VALUES
    ('tasos', 'leivaditis'),
    ('jr', 'tolkien'),
    ('dmitry', 'glukhovski'),
    ('hans cristian', 'andersen'),
    ('Victoria', 'Stone'),
    ('Adam','Southward'),
    ('Delia','Owens'),
    ('James', 'Patterson');

INSERT INTO category
    (categoryname)
VALUES
    ('fiction'),
    ('culture');
    
INSERT INTO category
VALUES
    ('sci-fi','fiction'),
    ('romance','culture'),
    ('history','culture');

INSERT INTO copies
    (isbn, copynr)
VALUES
    ('1948576910', '1'),
    ('1948576910', '2'),
    ('1948576910', '3'),
    ('1574930452', '1'),
    ('1574930452', '2'),
    ('1574930452', '3'),
    ('1595003214', '1'),
    ('1743549801', '1'),
    ('1309458796', '1'), 
    ('1134589703', '1'),
    ('1134589703', '2'), 
    ('1456907891', '1'),
    ('1456907891', '2'),
    ('1456907891', '3');


INSERT INTO employee
    ( efirst, elast, salary)
VALUES
    ('giorgos','darikas','250'),
    ('danny','green','100');

INSERT INTO permanent_employee
    (empid)
VALUES
    ('1');

INSERT INTO temporary_employee
    (empid)
VALUES
    ('2');

INSERT INTO belongs_to
    (isbn, categoryname)
VALUES
    ('1948576910','fiction'),
    ('1948576910','culture'),
    ('1948576910','history'),
    ('1574930452','fiction'),
    ('1574930452','sci-fi'),
    ('1595003214','fiction'),
    ('1743549801','culture'),
    ('1743549801','romance'),
    ('1309458796','sci-fi'),
    ('1134589703','sci-fi'),
    ('1456907891','romance');

INSERT INTO written_by
    (isbn, authid)
VALUES
    ('1948576910', '3'),
    ('1574930452', '6'),
    ('1595003214', '1'),
    ('1743549801', '4'),
    ('1309458796', '3'),
    ('1134589703', '5'),
    ('1456907891', '2');

INSERT INTO borrows
VALUES 
    ('1', '1948576910', '1', '6/6/2019', '7/6/2019'),
    ('4', '1574930452', '1', '6/6/2019', '7/6/2019'),
    ('2', '1743549801', '1', '6/6/2019', '7/6/2019'),
    ('3', '1134589703', '1', '6/6/2019', '7/6/2019');
