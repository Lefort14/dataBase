CREATE OR REPLACE FUNCTION add_book(
    p_description  TEXT,
    p_isbn          TEXT,
    p_shelf_number INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_serial INT;
    v_max_shelf  INT;
BEGIN
    -- 1. Глобальная блокировка для проверки целостности полок
    PERFORM pg_advisory_xact_lock(99999);

    -- 2. Получаем текущий максимум
    SELECT COALESCE(MAX(shelf_number), 0) INTO v_max_shelf FROM books;

    -- 3. Проверка условия (max + 1)
    IF p_shelf_number > v_max_shelf + 1 THEN
        RAISE NOTICE 'Операция отменена: нельзя создать полку %, так как текущий максимум %', 
                     p_shelf_number, v_max_shelf;
        RETURN NULL; -- Возвращаем пустоту вместо ошибки
    END IF;

    -- 4. Локальная блокировка полки для расчета serial_id
    PERFORM pg_advisory_xact_lock(p_shelf_number);

    -- 5. Расчет нового номера внутри полки
    SELECT COALESCE(MAX(serial_id), 0) + 1
    INTO v_new_serial
    FROM books
    WHERE shelf_number = p_shelf_number;

    -- 6. Вставка данных
    INSERT INTO books(serial_id, description, isbn, shelf_number)
    VALUES (v_new_serial, p_description, p_isbn, p_shelf_number);

    RETURN v_new_serial;

EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Конфликт уникальности на полке %', p_shelf_number;
        RETURN NULL;
END;
$$;

DROP FUNCTION add_book(text,text,integer)