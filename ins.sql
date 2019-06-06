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
    ('1948576910','history'),
    ('1574930452','sci-fi'),
    ('1595003214','fiction'),
    ('1743549801','culture'),
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
