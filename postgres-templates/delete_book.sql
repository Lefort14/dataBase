CREATE OR REPLACE FUNCTION delete_book(
    p_serial_id    INT,
    p_shelf_number INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM books
        WHERE shelf_number = p_shelf_number
          AND serial_id = p_serial_id
    ) THEN
        RETURN NULL;
    END IF;

    IF NOT EXISTS (
           SELECT 1
           FROM books
           WHERE shelf_number = p_shelf_number
             AND serial_id <> p_serial_id
       )
       AND EXISTS (
           SELECT 1
           FROM books
           WHERE shelf_number > p_shelf_number
       )
    THEN
        RETURN NULL;
    END IF;

    DELETE FROM books
    WHERE shelf_number = p_shelf_number
      AND serial_id = p_serial_id;

    UPDATE books
    SET serial_id = serial_id - 1
    WHERE shelf_number = p_shelf_number
      AND serial_id > p_serial_id;

    RETURN 1;
END;
$$;




