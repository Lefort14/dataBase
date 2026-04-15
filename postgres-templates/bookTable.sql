CREATE TABLE books(
	book_id 		SERIAL NOT NULL PRIMARY KEY,
	serial_id 		INT NOT NULL,
	description 	TEXT NOT NULL,
	isbn			TEXT NOT NULL,
	shelf_number	INT NOT NULL
);

DROP TABLE books


-- 2. Ускорение операций
CREATE INDEX ix_books_shelf
ON books (shelf_number, serial_id);

ALTER TABLE books
ADD CONSTRAINT ux_books_shelf_serial
UNIQUE (shelf_number, serial_id)
DEFERRABLE INITIALLY DEFERRED;



DROP INDEX ux_books_shelf_serial

DROP TABLE books

SELECT * FROM books

TRUNCATE TABLE books RESTART IDENTITY;

