CREATE OR REPLACE FUNCTION patch_book(
    p_shelf_number    INT,                 -- ТЕКУЩАЯ ПОЛКА (из глобального состояния)
    p_current_serial  INT,                 -- текущий порядковый номер на полке
    p_new_serial      TEXT DEFAULT NULL,   -- новый номер (swap)
    p_new_description TEXT DEFAULT NULL,
    p_new_isbn        TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_book books%ROWTYPE;
    v_target_book  books%ROWTYPE;
    v_new_serial   INT;
BEGIN
    ------------------------------------------------------------------
    -- защита от гонок (на уровне полки)
    ------------------------------------------------------------------
    PERFORM pg_advisory_xact_lock(p_shelf_number);

    ------------------------------------------------------------------
    -- 1. текущая книга (ТОЛЬКО В УКАЗАННОЙ ПОЛКЕ)
    ------------------------------------------------------------------
    SELECT *
    INTO v_current_book
    FROM books
    WHERE shelf_number = p_shelf_number
      AND serial_id    = p_current_serial;

    IF NOT FOUND THEN
		RETURN json_build_object(
			    'reply', 'Ошибка: книга не найдена на указанной полке',
			    'success', false
		);
    END IF;

    ------------------------------------------------------------------
    -- 2. парсинг нового порядкового номера
    ------------------------------------------------------------------
    IF p_new_serial IS NOT NULL AND TRIM(p_new_serial) <> '' THEN
        v_new_serial := p_new_serial::INT;
    END IF;

    ------------------------------------------------------------------
    -- 3. обновление description / isbn (опционально)
    ------------------------------------------------------------------
    UPDATE books
    SET
        description = COALESCE(NULLIF(p_new_description, ''), description),
        isbn        = COALESCE(NULLIF(p_new_isbn, ''), isbn)
    WHERE book_id = v_current_book.book_id;

    ------------------------------------------------------------------
    -- 4. swap порядковых номеров В РАМКАХ ЭТОЙ ЖЕ ПОЛКИ
    ------------------------------------------------------------------
    IF v_new_serial IS NOT NULL
       AND v_new_serial <> p_current_serial THEN

        SELECT *
        INTO v_target_book
        FROM books
        WHERE shelf_number = p_shelf_number
          AND serial_id    = v_new_serial;

        IF NOT FOUND THEN
			RETURN json_build_object(
			    'reply', 'Ошибка: книга с новым номером не найдена на этой полке',
			    'success', false
			);
        END IF;

        -- атомарный swap
        UPDATE books
        SET serial_id = CASE
            WHEN book_id = v_current_book.book_id THEN v_new_serial
            WHEN book_id = v_target_book.book_id  THEN p_current_serial
        END
        WHERE book_id IN (
            v_current_book.book_id,
            v_target_book.book_id
        );
		RETURN json_build_object(
			    'reply', 'Успешно: книги поменяны местами на полке',
			    'success', true
			);
    END IF;

    ------------------------------------------------------------------
    -- 5. если был только апдейт данных
    ------------------------------------------------------------------
	RETURN json_build_object(
			    'reply', 'Успешно: данные книги обновлены',
			    'success', true
			);
EXCEPTION
    WHEN invalid_text_representation THEN
		RETURN json_build_object(
			    'reply', 'Ошибка: неверный формат порядкового номера',
			    'success', false
			);
    WHEN unique_violation THEN
		RETURN json_build_object(
			    'reply', 'Ошибка: конфликт порядковых номеров на полке',
			    'success', false
			);
    WHEN OTHERS THEN
		RETURN json_build_object(
			    'reply', 'Ошибка: ' || SQLERRM,
			    'success', false
			);
END;
$$;




