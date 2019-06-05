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
--INSERT INTO book (ISBN, Title , numpages )
--VALUES  ('1948576910', 'Game of Thrones', '520'),
  --      ('1574930452', 'False Step','421'),
   --     ('1595003214', 'Along the Broken Bay','776'),
    --    ('1743549801', 'Bad Therapist', '541');

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
VALUES
    ('fiction','NULL'),
    ('sci-fi','fiction'),
    ('culture','NULL'),
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


--C:/Users/Vagelis/Documents/dbs/app1/ins.sql link for inserting