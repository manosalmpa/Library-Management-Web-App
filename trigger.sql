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