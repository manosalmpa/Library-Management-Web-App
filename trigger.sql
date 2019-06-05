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

CREATE OR REPLACE FUNCTION employee_status() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO reminder
    VALUES('1', NEW.memberid, NEW.isbn, NEW.copynr, NEW.date_of_borrowing, NEW.date_of_return);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS 
ON borrows;

CREATE TRIGGER cr_reminder
AFTER
INSERT ON
borrows
FOR
EACH
ROW
EXECUTE PROCEDURE create_reminder
();