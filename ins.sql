<<<<<<< HEAD
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
=======
--INSERT INTO book (ISBN, Title , numpages )
--VALUES  ('1948576910', 'Game of Thrones', '520'),
  --      ('1574930452', 'False Step','421'),
   --     ('1595003214', 'Along the Broken Bay','776'),
    --    ('1743549801', 'Bad Therapist', '541');
>>>>>>> cd076cdf6bad5f8375e5cdc05828f2546afae6f2

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
    ('tasos', 'Game of Thrones'),
    ('1574930452', 'False Step'),
    ('1595003214', 'Along the Broken Bay'),
    ('1743549801', 'Bad Therapist');

INSERT INTO author (authid, afirst, alast )
VALUES  ('1', 'Victoria', 'Stone'),
        ('2', 'Adam','Southward'),
        ('3', 'Delia','Owens'),
        ('4', 'James', 'Patterson');




--C:/Users/Vagelis/Documents/dbs/app1/ins.sql link for inserting