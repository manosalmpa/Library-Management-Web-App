--path C:/Users/Vagelis/Documents/dbs/app1/ins.sql
INSERT INTO member
    (mfirst, mlast)
VALUES
    ('michalis', 'xatzis'),
    ('vaggelis', 'viskadouros'),
    ('manos', 'alba'),
    ('panos','kousoulos'),
    ('vaggelis','psaradelis');

INSERT INTO book (isbn, title , numpages )
VALUES  ('1948576910', 'Game of Thrones', '520'),
        ('1574930452', 'False Step','421'),
        ('1595003214', 'Along the Broken Bay','776'),
        ('1743549801', 'Bad Therapist', '541');

INSERT INTO publisher
    (pubname)
VALUES
    ('patakis'),
    ('oikonomopoulos'),
    ('tsotras'),
    ('garoutsos');

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
    ('1948576910','1'),
    ('1948576910','2'),
    ('1948576910','3'),
    ('1574930452', '1'),
    ('1574930452', '2'),
    ('1574930452', '3'),
    ('1595003214', '1'),
    ('1743549801','1');

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
    ('1743549801','romance');

INSERT INTO written_by
    (isbn, authid)
VALUES
    ('1948576910', '3'),
    ('1574930452', '6'),
    ('1595003214', '1'),
    ('1743549801', '4');


